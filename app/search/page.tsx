import { db } from "@/lib/db";
import { StationCard } from "./_components/station-card";
import { haversineDistance } from "@/lib/utils";
import Loading from "./loading";


export default async function SearchPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { lat, long, fuelType, radius, tankSize } = searchParams as { [key: string]: string };

    let parsedLat: number | null = null;
    let parsedLong: number | null = null;
    const parsedRadius = parseFloat(radius ?? "0");
    const parsedTankSize = parseFloat(tankSize ?? "0");

    // Try to parse latitude and longitude
    if (lat && long) {
        parsedLat = parseFloat(lat);
        parsedLong = parseFloat(long);

        // Check if parsing was successful
        if (isNaN(parsedLat) || isNaN(parsedLong)) {
            parsedLat = null;
            parsedLong = null;
        }
    }

    if (parsedLat !== null && parsedLong !== null && fuelType) {
        const stations = await db.query.stations.findMany();

        const stationsWithDistanceMiddle = stations.map(station => ({
            ...station,
            distance: parseFloat(haversineDistance(parsedLat!, parsedLong!, station.latitude, station.longitude).toFixed(1))
        }))
            .filter(station => station.distance <= parsedRadius)

        const stationsWithDistanceAgain = await db.query.stations.findMany({
            with: {
                prices: {
                    // Trying to reduce the size returned as more prices are retrieved by ordering
                    // by ID assuming the later prices are more recent and then limiting to 15.
                    orderBy: (prices, { desc }) => [desc(prices.id)],
                    limit: 10
                }
            },
            where: (station, { inArray }) => inArray(station.id, stationsWithDistanceMiddle.map(station => station.id))
        });

        const stationsWithDistance = stationsWithDistanceAgain.map(station => {
            const uniquePrices = station.prices.reduce((acc: { [key: string]: any }, price) => {
                if (!acc[price.fuelType] || new Date(price.lastUpdatedUTC) > new Date(acc[price.fuelType].lastUpdatedUTC)) {
                    acc[price.fuelType] = price;
                }
                return acc;
            }, {});

            return {
                ...station,
                distance: stationsWithDistanceMiddle.find(s => s.id === station.id)?.distance ?? 0,
                prices: Object.values(uniquePrices)
            };
        })
            .filter(station => station.prices.some(price => price.fuelType === fuelType))
            // .sort((a, b) => a.distance - b.distance);
            .sort((a, b) => {
                const priceA = a.prices.find(price => price.fuelType === fuelType)?.price ?? Infinity;
                const priceB = b.prices.find(price => price.fuelType === fuelType)?.price ?? Infinity;
                return priceA - priceB;
            });
        // THOUGHT: Remove the limit for now so they get as many options as they want.
        // .slice(0, 20);

        const lowestPrice = stationsWithDistance.reduce((lowest, station) => {
            let stationPrice = station.prices.find(price => price.fuelType === fuelType)!.price;
            if (stationPrice < lowest) {
                return stationPrice;
            } else {
                return lowest;
            }
        }, Infinity);


        return (
            <div className="grid gap-2 md:gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                {stationsWithDistance?.map(station => (<StationCard key={station.id} station={station} primaryFuelType={fuelType} lowestPrice={lowestPrice} tankSize={parsedTankSize} />))}
            </div>
        )
    }

    return <Loading />
}
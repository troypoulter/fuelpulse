import { db } from "@/lib/db";
import { StationCard } from "./_components/station-card";
import { haversineDistance } from "@/lib/utils";
import Loading from "./loading";
import { eq } from "drizzle-orm";


export default async function SearchPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { lat, long } = searchParams as { [key: string]: string };
    const radius = 10;
    const fuelType = 'E10';

    let parsedLat: number | null = null;
    let parsedLong: number | null = null;

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

    if (parsedLat !== null && parsedLong !== null) {
        const stations = await db.query.stations.findMany();

        const stationsWithDistanceMiddle = stations.map(station => ({
            ...station,
            distance: parseFloat(haversineDistance(parsedLat!, parsedLong!, station.latitude, station.longitude).toFixed(1))
        }))
            .filter(station => station.distance <= radius)

        const stationsWithDistanceAgain = await db.query.stations.findMany({
            with: {
                prices: {
                    // Trying to reduce the size returned as more prices are retrieved by ordering
                    // by ID assuming the later prices are more recent and then limiting to 15.
                    orderBy: (prices, { desc }) => [desc(prices.id)],
                    limit: 15
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
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);


        return (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {stationsWithDistance?.map(station => (<StationCard key={station.id} station={station} primaryFuelType={fuelType} />))}
            </div>
        )
    }

    return <Loading />
}
import { db } from "@/lib/db";
import { StationCard } from "./_components/station-card";
import { cn, haversineDistance, executeQueryWithSentry } from "@/lib/utils";
import Loading from "./loading";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import Balance from "react-wrap-balancer"
import { stations as stationsSchema } from "@/lib/db/schema";
import { sql, lte } from 'drizzle-orm'

export default async function SearchPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { lat, long, fuelType, radius, tankSize, sortBy } = searchParams as { [key: string]: string };

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

    if (parsedLat !== null && parsedLong !== null && fuelType && parsedRadius && parsedTankSize && sortBy) {
        const findStationsQuery = db.query.stations.findMany({
            extras: {
                distance: sql<number>`
                6371 * acos(
                    cos(radians(${parsedLat}))
                    * cos(radians(${stationsSchema.latitude}))
                    * cos(radians(${stationsSchema.longitude}) - radians(${parsedLong}))
                    + sin(radians(${parsedLat}))
                    * sin(radians(${stationsSchema.latitude}))
                  )
                `.as('distance')
            },
            where: (lte(sql`distance`, parsedRadius)),
            with: {
                prices: {
                    // Trying to reduce the size returned as more prices are retrieved by ordering
                    // by ID assuming the later prices are more recent and then limiting to 15.
                    orderBy: (prices, { desc }) => [desc(prices.id)],
                    limit: 10
                }
            },
        });
        const stations = await executeQueryWithSentry(findStationsQuery);

        if (stations.length === 0) {
            // TODO: Update to use something like https://github.com/rapideditor/country-coder when supporting more states.
            // Rough bounds for NSW.
            if (parsedLat < -37.505 || parsedLat > -28.157 || parsedLong < 140.999 || parsedLong > 153.552) {
                return (
                    <div className="flex flex-col items-center justify-center gap-y-4 h-full">
                        <div className="flex flex-col gap-y-2 text-center">
                            <h2 className="text-2xl font-bold">No fuel stations found</h2>
                            <Balance className="text-gray-500 mx-auto flex max-w-[980px] flex-col items-center">You are likely outside of New South Wales, Australia, which is currently the only area supported. You can click the button below to check out fuel prices in Sydney to see what it looks like!</Balance>
                            <Link href="/search?lat=-33.8930404&long=151.2765367" className={cn(buttonVariants())}>
                                <Navigation className="mr-1 h-4 w-4" /> Check out fuel prices in Sydney
                            </Link>
                        </div>
                    </div>
                )
            }

            // TODO: Use more descriptive return for not found at different stages.
            return (
                <div className="flex flex-col items-center justify-center gap-y-4 h-full">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h2 className="text-2xl font-bold">No fuel stations found</h2>
                        <Balance className="text-gray-500 mx-auto flex max-w-[980px] flex-col items-center">Try increasing the search radius. You can click the button below to check out fuel prices in Sydney to see what it looks like!</Balance>
                        <Link href="/search?lat=-33.8930404&long=151.2765367" className={cn(buttonVariants())}>
                            <Navigation className="mr-1 h-4 w-4" /> Check out fuel prices in Sydney
                        </Link>
                    </div>
                </div>
            )
        }

        const stationsWithDistance = stations.map(station => {
            const uniquePrices = station.prices.reduce((acc: { [key: string]: any }, price) => {
                if (!acc[price.fuelType] || new Date(price.lastUpdatedUTC) > new Date(acc[price.fuelType].lastUpdatedUTC)) {
                    acc[price.fuelType] = price;
                }
                return acc;
            }, {});

            return {
                ...station,
                distance: stations.find(s => s.id === station.id)?.distance ?? 0,
                prices: Object.values(uniquePrices)
            };
        })
            .filter(station => station.prices.some(price => price.fuelType === fuelType))
            .sort((a, b) => {
                if (sortBy === "distance") {
                    // sort by distance
                    return a.distance - b.distance;
                } else {
                    // sort by price or if sortBy is neither "price" nor "distance"
                    const priceA = a.prices.find(price => price.fuelType === fuelType)?.price ?? Infinity;
                    const priceB = b.prices.find(price => price.fuelType === fuelType)?.price ?? Infinity;
                    return priceA - priceB;
                }
            })
            .slice(0, 20);

        if (stationsWithDistance.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center gap-y-4 h-full">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h2 className="text-2xl font-bold">No fuel stations found</h2>
                        <Balance className="text-gray-500 mx-auto flex max-w-[980px] flex-col items-center">Try increasing the search radius. You can click the button below to check out fuel prices in Sydney to see what it looks like!</Balance>
                        <Link href="/search?lat=-33.8930404&long=151.2765367" className={cn(buttonVariants())}>
                            <Navigation className="mr-1 h-4 w-4" /> Check out fuel prices in Sydney
                        </Link>
                    </div>
                </div>
            )
        }

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
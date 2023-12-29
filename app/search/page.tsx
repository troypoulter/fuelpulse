import { db } from "@/lib/db";
import { StationCard } from "./_components/station-card";
import { haversineDistance } from "@/lib/utils";


export default async function SearchPage({
    searchParams
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const { lat, long } = searchParams as { [key: string]: string };
    const radius = 10;

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
        const stations = await db.query.stations.findMany({
            with: {
                prices: true
            }
        });

        const stationsWithDistance = stations.map(station => ({
            ...station,
            distance: parseFloat(haversineDistance(parsedLat!, parsedLong!, station.latitude, station.longitude).toFixed(2))
        }))
            .filter(station => station.distance <= radius)
            .filter(station => station.prices.some(price => price.fuelType === 'E10'))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10);


        return (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {stationsWithDistance?.map(station => (<StationCard key={station.id} station={station} />))}
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-3">
                <p className="text-center text-2xl font-semibold">No results found</p>
            </div>
        </div>
    )
}
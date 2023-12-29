import { db } from "@/lib/db";
import { StationCard } from "./_components/station-card";


export default async function SearchPage() {
    const stations = await db.query.stations.findMany({
        limit: 10,
        with: {
            prices: true
        }
    });

    return (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {stations?.map(station => (<StationCard key={station.id} station={station} />))}
        </div>
    )
}
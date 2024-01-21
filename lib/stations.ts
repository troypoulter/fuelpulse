import { cache } from 'react'
import { db } from "@/lib/db";
import { executeQueryWithSentry } from "@/lib/utils";

export const getStations = cache(async () => {
    const findStationsQuery = db.query.stations.findMany();
    const stations = await executeQueryWithSentry(findStationsQuery);
    return stations
})
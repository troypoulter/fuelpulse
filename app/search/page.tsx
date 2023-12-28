import { db } from "@/lib/db";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SearchPage() {
    const stations = await db.query.stations.findMany({
        limit: 10,
        with: {
            prices: true
        }
    });

    return (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {
                stations?.map(station => (
                    <Card key={station.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">{station.name}</h2>
                                    <p className="text-sm text-gray-500">{station.address}</p>
                                    <p className="text-sm text-gray-500">Lat: {station.latitude} Long: {station.longitude}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">4.6km</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                {station.prices.map(price => (
                                    <Badge key={price.fuelType}>{`${price.fuelType}: ${price.price}`}</Badge>
                                ))}
                            </div>
                        </CardContent>
                        <div className="m-4">
                            <Button asChild>
                                <Link href="#">View Details</Link>
                            </Button>
                        </div>
                    </Card>))
            }</div>
    )
}
import { db } from "@/lib/db";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Fuel } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
                            <CardTitle className="flex flex-row"><Fuel className="mr-2 text-blue-500 font-bold" /> {station.name}</CardTitle>
                            <CardDescription>{station.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Separator className="mb-2" />
                            <div className="grid gap-2 grid-cols-3">
                                {station.prices.map(price => (
                                    <div key={price.fuelType} className="text-sm text-muted-foreground">{`${price.fuelType}: ${price.price}`}</div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>))
            }</div>
    )
}
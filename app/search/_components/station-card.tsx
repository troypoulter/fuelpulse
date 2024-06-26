import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { formatDistanceToNow } from 'date-fns';
import { StationWithPricesAndDistance } from "@/lib/db/schema";
import { Button } from '@/components/ui/button';
import { MapPinned, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from "next/link"

export const StationCard = ({ station, primaryFuelType, lowestPrice, tankSize }: { station: StationWithPricesAndDistance, primaryFuelType: string, lowestPrice: number, tankSize: number }) => {
    const primaryFuel = station.prices.find(s => s.fuelType === primaryFuelType)!;
    const priceDifferenceNumber = (((primaryFuel.price ?? 0) / 100 * tankSize) - (lowestPrice !== Infinity ? lowestPrice / 100 * tankSize : 0));
    const priceDifference = priceDifferenceNumber.toFixed(2);

    const priceDifferenceCents = (((primaryFuel.price ?? 0)) - (lowestPrice !== Infinity ? lowestPrice : 0)).toFixed(1);

    const getPriceDifferenceColour = (price: number) => {
        if (price === lowestPrice) return 'bg-emerald-500 text-emerald-500';
        if (price < lowestPrice + 12.5) return 'bg-yellow-500 text-yellow-500';
        if (price < lowestPrice + 25) return 'bg-orange-500 text-orange-500';
        return 'bg-red-500 text-red-500';
    }

    return (
        <Card key={station.id} className={cn(primaryFuel.price === lowestPrice && "border-emerald-500 border-4 border-opacity-70")}>
            <CardHeader className="flex flex-row items-center pb-0">
                <div className="flex flex-col gap-y-1 mr-2">
                    <CardTitle className="flex flex-row font-medium lg:h-9 lg:overflow-auto">{station.name}</CardTitle>
                    <CardDescription className="lg:h-10 lg:overflow-auto">{station.address}</CardDescription>
                </div>
                <div className="flex flex-col gap-y-2">
                <Button variant="outline" size="sm" asChild>
                    <a href={`https://maps.google.com/?saddr=Current+Location&daddr=${encodeURIComponent(station.address)}`} target="_blank" rel="noopener noreferrer">
                        <MapPinned className="mr-1 h-4 w-4" />{station.distance.toFixed(1)}km
                    </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/stations/${station.id}`}>
                        <Info className="mr-1 h-4 w-4" /> Details
                    </Link>
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex flex-col items-start gap-y-2">
                                <div className={cn("inline-flex justify-start items-baseline rounded-lg bg-opacity-20 px-1.5 py-1 text-xs font-medium", getPriceDifferenceColour(primaryFuel.price))}>+${priceDifference} (+{priceDifferenceCents}c/L)</div>
                                <div className="flex items-baseline gap-x-1">
                                    <div className="text-xl font-bold"><span className="tracking-tight font-normal text-xs">{primaryFuelType}</span> {((primaryFuel.price ?? 0) / 100 * tankSize).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</div>
                                    <span className="text-xs text-muted-foreground">
                                        (<span className="font-bold">{primaryFuel.price}</span>c/L for {tankSize}L)
                                    </span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="text-xs mb-2 flex justify-center items-center">
                                <span className="bg-muted text-muted-foreground rounded-lg px-2.5 py-0.5 ">
                                    Reported by station {primaryFuel.lastUpdatedUTC
                                        ? <span className="font-semibold">{`${formatDistanceToNow(new Date(primaryFuel.lastUpdatedUTC || Date.now()))} ago`}</span>
                                        : "N/A"
                                    }
                                </span>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fuel Type</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Per Litre</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {station.prices.map(price => (
                                        <TableRow key={price.fuelType}>
                                            <TableCell className="font-semibold">{price.fuelType}</TableCell>
                                            <TableCell>{(price.price / 100 * tankSize).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</TableCell>
                                            <TableCell>{price.price}c/L</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>)
};
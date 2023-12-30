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
import { MapPinned } from 'lucide-react';

export const StationCard = ({ station, primaryFuelType, lowestPrice }: { station: StationWithPricesAndDistance, primaryFuelType: string, lowestPrice: number }) => {
    const primaryFuel = station.prices.find(s => s.fuelType === primaryFuelType)!;
    const priceDifference = (((primaryFuel.price ?? 0) / 100 * 30) - (lowestPrice !== Infinity ? lowestPrice / 100 * 30 : 0)).toFixed(2);

    return (
        <Card key={station.id}>
            <CardHeader className="flex flex-row items-center pb-0">
                <div className="flex flex-col gap-y-1 mr-2">
                    <CardTitle className="flex flex-row font-medium">{station.name}</CardTitle>
                    <CardDescription>{station.address}</CardDescription>
                </div>
                <Button variant="outline" className="ml-auto self-start" size="sm" asChild>
                    <a href={`https://maps.google.com/?saddr=Current+Location&daddr=${encodeURIComponent(station.address)}`} target="_blank" rel="noopener noreferrer">
                        <MapPinned className="mr-1 h-4 w-4" />{station.distance}km
                    </a>
                </Button>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex items-baseline gap-x-1">
                                <div className="text-xl font-bold"><span className="tracking-tight font-normal text-sm">{primaryFuelType}</span> {((primaryFuel.price ?? 0) / 100 * 30).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</div>
                                <span className="text-xs text-muted-foreground">
                                    +${priceDifference} (<span className="font-bold">{primaryFuel.price}</span>c/L for 30L)
                                </span>
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
                                            <TableCell>{(price.price / 100 * 30).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</TableCell>
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
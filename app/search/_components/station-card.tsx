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
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from 'date-fns';
import { StationWithPricesAndDistance } from "@/lib/db/schema";

export const StationCard = ({ station }: { station: StationWithPricesAndDistance }) => {
    return (
        <Card key={station.id}>
            <CardHeader>
                <CardTitle className="flex flex-row">{station.name} ({station.distance}km)</CardTitle>
                <CardDescription>{station.address}</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="mb-2" />
                <div className="scroll-m-20 text-base tracking-tight flex items-center gap-x-2"><span className="font-semibold">E10</span> <div className="text-xs inline-block">
                    <span className="bg-muted text-muted-foreground rounded-lg px-2.5 py-0.5 ">
                        Reported by station {station.prices.find(price => price.fuelType === 'E10')?.lastUpdatedUTC
                            ? <span className="font-semibold">{`${formatDistanceToNow(new Date(station.prices.find(s => s.fuelType === 'E10')?.lastUpdatedUTC || Date.now()))} ago`}</span>
                            : "N/A"
                        }
                    </span>
                </div>
                </div>
                <div className="flex items-baseline gap-x-2">
                    <div className="text-xl font-bold">{((station.prices.find(price => price.fuelType === 'E10')?.price ?? 0) / 100 * 30).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</div>
                    <p className="text-xs text-muted-foreground">
                        ({station.prices.find(s => s.fuelType === 'E10')?.price}c/L for 30L)
                    </p>
                </div>
                <Separator className="mt-2" />
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm">View all {station.prices.length} fuel prices</AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fuel Type</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Per Litre</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {station.prices.map(price => (
                                        <TableRow key={price.fuelType}>
                                            <TableCell className="font-semibold">{price.fuelType}</TableCell>
                                            <TableCell>{(price.price / 100 * 30).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</TableCell>
                                            <TableCell>{price.price}c/L</TableCell>
                                            <TableCell>{price.lastUpdatedRaw}</TableCell>
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
import { db } from "@/lib/db";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
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
                            <CardTitle className="flex flex-row">{station.name}</CardTitle>
                            <CardDescription>{station.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Separator className="mb-2" />
                            <div className="scroll-m-20 text-base tracking-tight">E10</div>
                            <div className="flex items-baseline gap-x-2">
                                <div className="text-xl font-bold">{((station.prices.find(s => s.fuelType === 'E10')?.price ?? 0) / 100 * 30).toLocaleString("en-AU", { style: "currency", currency: "AUD" })}</div>
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
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {station.prices.map(price => (
                                                    <TableRow key={price.fuelType}>
                                                        <TableCell>{price.fuelType}</TableCell>
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
                    </Card>))
            }</div>
    )
}
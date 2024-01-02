import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { Announcement } from "@/components/announcement"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Fuel, HelpCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { db } from "@/lib/db"
import { count } from "drizzle-orm"
import { stations } from "@/lib/db/schema"


export default async function Home() {
    const totalStations = await db.select({ value: count() }).from(stations);

    return (
        <div>
            <PageHeader>
                <Announcement />
                <PageHeaderHeading>Find the best fuel price across {totalStations[0]?.value.toLocaleString()} stations in Australia</PageHeaderHeading>
                <PageHeaderDescription>
                    Effortlessly locate the most economical fuel options near you.
                    Streamlined. User-Friendly. Constantly Updated.
                </PageHeaderDescription>
                <PageActions>
                    <Link href="/search" className={cn(buttonVariants())}>
                        <Fuel className="mr-1 h-4 w-4" /> Find Fuel Near Me
                    </Link>
                    {/* <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                        Learn more
                    </Link> */}
                </PageActions>
            </PageHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-center">
                    Currently supported states and territories
                </h3>
                <Image
                    src="/australia_coverage.png"
                    alt="Australia Coverage"
                    width={450}
                    height={450}
                    priority
                />
                <div className="flex space-x-4">
                    <div className="text-emerald-500 text-lg tracking-tight font-bold">Supported</div>
                    <div className="text-orange-500 text-lg tracking-tight font-bold">Coming Soon</div>
                    <div className="text-red-500 text-lg tracking-tight font-bold">Not Supported</div>
                </div>
                <Alert className="max-w-lg">
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>Why is Victoria not supported?</AlertTitle>
                    <AlertDescription>
                        Victoria does not provide a public API for fuel prices, unlike the other states and territories.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}
import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { Announcement } from "@/components/announcement"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Fuel } from "lucide-react"
import Link from "next/link"

export default function Home() {
    return (
        <PageHeader>
            <Announcement />
            <PageHeaderHeading>Find the best fuel price in Australia</PageHeaderHeading>
            <PageHeaderDescription>
                Effortlessly locate the most economical fuel options near you.
                Streamlined. User-Friendly. Constantly Updated.
            </PageHeaderDescription>
            <PageActions>
                <Link href="/search" className={cn(buttonVariants())}>
                    <Fuel className="mr-1 h-4 w-4" /> Find Fuel Near Me
                </Link>
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
                    Learn more
                </Link>
            </PageActions>
        </PageHeader>
    )
}
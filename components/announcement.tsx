// This code is adapted from:
// https://github.com/shadcn-ui/ui/blob/main/apps/www/components/announcement.tsx

import Link from "next/link"
// import { ArrowRight } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export function Announcement() {
    // TODO: Add a changelog/blog for this to link to when updates are added.
    return (
        <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium hover:opacity-75 transition-opacity"
        >
            🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
            <span className="inline">
                NSW now supported.
            </span>
            {/* <ArrowRight className="ml-1 h-4 w-4" /> */}
        </Link>
    )
}

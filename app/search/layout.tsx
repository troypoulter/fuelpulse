import { Suspense } from "react";
import { SearchInputs } from "./_components/search-inputs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search",
    description: "Search and apply filters to find the best fuel price in Australia"
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <div className="flex flex-col gap-y-4">
                <Suspense fallback={<Skeleton className="h-8" />}>
                    <SearchInputs />
                </Suspense>
                <Separator />
                {children}
            </div>
        </Suspense>
    )
}
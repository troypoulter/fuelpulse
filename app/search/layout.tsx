import { Suspense } from "react";
import { SearchInputs } from "./_components/search-inputs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

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
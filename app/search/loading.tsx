import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from '@/components/ui/card';


export default function Loading() {
    return (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array(5).fill(0).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
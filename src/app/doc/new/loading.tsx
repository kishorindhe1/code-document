import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-10 w-[150px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-5 max-w-2.5" />

                <Skeleton className="h-40 w-full" />
            </div>
        </div>
    )
}

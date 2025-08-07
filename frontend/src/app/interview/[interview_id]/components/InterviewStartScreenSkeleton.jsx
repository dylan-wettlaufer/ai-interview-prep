import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";


export default function InterviewStartScreenSkeleton() {
    return (
        <div className="max-w-7xl w-screen h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col gap-8">
                        <div className="flex-1 text-center">
                            <Skeleton className="h-10 w-96 mx-auto mb-2" />
                            <Skeleton className="h-6 w-80 mx-auto" />
                        </div>
                        <div className="flex flex-col items-center gap-4 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-lg p-6 shadow-lg border border-neutral-700">
                            <Skeleton className="h-14 w-14 rounded-full bg-neutral-700" />
                            <Skeleton className="h-8 w-64" />
                            <div className="flex flex-row items-start justify-between gap-6 mb-4">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                            <Separator className="bg-neutral-700" />
                            <div className="flex flex-col justify-start items-start gap-2 text-left mt-4 w-full">
                                <Skeleton className="h-6 w-48 mb-2" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                            <Separator className="bg-neutral-700" />
                            <div className="flex flex-col justify-start items-start gap-2 mt-2 w-full">
                                <Skeleton className="h-6 w-48 mb-4" />
                                <div className="flex flex-row gap-6 w-full">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
    )
}
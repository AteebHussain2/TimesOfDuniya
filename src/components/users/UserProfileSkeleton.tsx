import { Skeleton } from "../ui/skeleton"

const UserProfileSkeleton = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 px-4 py-2.5">
            <div className="w-full flex flex-col items-center justify-center gap-4 px-4 py-6">
                <Skeleton
                    className="rounded-full object-cover aspect-square size-[112px]"
                />
                <span className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-2 justify-center">
                        <Skeleton className="rounded-sm w-[100px] h-[16px]" />
                        <Skeleton className="rounded-sm w-[50px] h-[16px]" />
                    </span>
                    <Skeleton className="rounded-sm w-[150px] h-[14px]" />
                    <Skeleton className="rounded-sm w-[50px] h-[14px]" />
                </span>
            </div>
        </div>
    )
}

export default UserProfileSkeleton

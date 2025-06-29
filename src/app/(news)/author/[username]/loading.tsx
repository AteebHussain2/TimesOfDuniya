import { Skeleton } from "@/components/ui/skeleton"
import { PostCardSkeleton } from "@/components/loading/post-card-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Author Header Skeleton */}
        <div className="bg-card rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Author's Posts Skeleton */}
        <div>
          <Skeleton className="h-7 w-56 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

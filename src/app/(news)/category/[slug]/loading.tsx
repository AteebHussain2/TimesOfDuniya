import { CategoryCarouselSkeleton } from "@/components/loading/category-carousel-skeleton"
import { PostCardSkeleton } from "@/components/loading/post-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Header Skeleton */}
        <div className="mb-8 pb-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Main Content Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Carousel Skeleton */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <CategoryCarouselSkeleton />
            </div>

            {/* More Articles Section Skeleton */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostCardSkeleton key={i} horizontal={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Trending Section Skeleton */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <PostCardSkeleton compact={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Related Categories Skeleton */}
            <div className="bg-card border rounded-lg p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

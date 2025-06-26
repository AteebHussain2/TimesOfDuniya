import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCarouselSkeleton() {
  return (
    <div className="relative">
      {/* Main Carousel Skeleton */}
      <Card className="overflow-hidden shadow-lg border-0">
        <div className="relative">
          <Skeleton className="aspect-video w-full" />

          {/* Navigation Controls Skeleton */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Auto-play Control Skeleton */}
          <div className="absolute top-4 right-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Content Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </Card>

      {/* Thumbnail Navigation Skeleton */}
      <div className="mt-4 flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="flex-shrink-0 w-20 h-15 rounded-lg" />
        ))}
      </div>

      {/* Progress Indicators Skeleton */}
      <div className="flex justify-center mt-3 space-x-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-2 w-2 rounded-full" />
        ))}
      </div>
    </div>
  )
}

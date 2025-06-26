import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PostCardSkeletonProps {
  featured?: boolean
  horizontal?: boolean
  compact?: boolean
}

export function PostCardSkeleton({ featured = false, horizontal = false, compact = false }: PostCardSkeletonProps) {
  if (featured) {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="aspect-video w-full" />
        <CardContent className="p-6">
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <div className="flex space-x-3 p-2">
        <Skeleton className="w-[60px] h-[45px] rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    )
  }

  // Default horizontal skeleton
  if (horizontal) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex space-x-4 p-4">
            <Skeleton className="w-[120px] h-[80px] rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="h-3 w-6" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex space-x-4 p-4">
          <Skeleton className="w-[120px] h-[80px] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-6" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

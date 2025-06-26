import { PostCardSkeleton } from "./post-card-skeleton"
import { TrendingSidebarSkeleton } from "./trending-sidebar-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breaking News Skeleton */}
      <div className="bg-rose-600 dark:bg-rose-700 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Skeleton className="bg-white/20 mr-4 h-6 w-20" />
            <Skeleton className="bg-white/20 h-4 flex-1" />
          </div>
        </div>
      </div>

      <div className="flex max-w-full">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section Skeleton */}
            <section className="mb-12">
              <PostCardSkeleton featured={true} />
            </section>

            {/* Trending Section Skeleton */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <Skeleton className="h-6 w-6 mr-2" />
                <Skeleton className="h-8 w-40" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </section>

            {/* Latest News Section Skeleton */}
            <section className="mb-12">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            </section>

            {/* Category Highlights Skeleton */}
            <section className="mb-12">
              <Skeleton className="h-8 w-56 mb-8" />
              <div className="space-y-12">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-6">
                      <Skeleton className="h-7 w-32" />
                      <Skeleton className="h-9 w-20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <PostCardSkeleton key={j} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <TrendingSidebarSkeleton />
      </div>
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PostPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header Skeleton */}
        <header className="mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-4/5 mb-6" />

          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-10 w-32 mb-8" />
        </header>

        {/* Engagement Skeleton */}
        <div className="py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>

        {/* Featured Image Skeleton */}
        <Skeleton className="aspect-video w-full mb-8" />

        {/* Article Content Skeleton */}
        <div className="prose prose-lg max-w-none mb-8">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-6" />

          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Tags Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-16 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

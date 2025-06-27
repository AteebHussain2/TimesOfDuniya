"use client"

import { getMoreLikeThis, getSuggestedForYou, getTrendingPosts, getPopularThisWeek, TrendingPost } from "@/lib/recommendation-engine";
import { PostCardSkeleton } from "@/components/loading/post-card-skeleton";
import { TrendingUp, Sparkles, ThumbsUp, Clock } from "lucide-react";
import { TypeGetAllPublishedPosts } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import PostCard from "./posts/PostCard";
import { useQuery } from "@tanstack/react-query";

interface MoreLikeThisProps {
    currentPost: TypeGetAllPublishedPosts[number]
}

export function MoreLikeThis({ currentPost }: MoreLikeThisProps) {
    const { data: similarPosts, isPending: isLoading } = useQuery({
        queryFn: () => getMoreLikeThis(currentPost, 4),
        queryKey: ['more-like-this', currentPost.id]
    })

    if (isLoading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <ThumbsUp className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-500" />
                    More like this
                </h2>
                <div className="flex flex-wrap gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (similarPosts?.length === 0) return null

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <ThumbsUp className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-500" />
                More like this
            </h2>
            <div className="flex flex-wrap gap-6">
                {similarPosts?.map((post) => (
                    <PostCard key={post.id} post={post} showAuthor={false} showViews={true} last={true} />
                ))}
            </div>
        </div>
    )
}

export function SuggestedForYou() {
    const [suggestedPosts, setSuggestedPosts] = useState<TypeGetAllPublishedPosts>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(async () => {
            const posts = await getSuggestedForYou(4)
            setSuggestedPosts(posts)
            setIsLoading(false)
        }, 400)
    }, [])

    if (isLoading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-500" />
                    Suggested for you
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-500" />
                Suggested for you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    )
}

interface TrendingPostsProps {
    limit?: number
    showInSidebar?: boolean
}

export function TrendingPosts({ limit = 6, showInSidebar = false }: TrendingPostsProps) {
    const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(async () => {
            const posts = await getTrendingPosts(limit)
            setTrendingPosts(posts)
            setIsLoading(false)
        }, 200)
    }, [limit])

    if (isLoading) {
        return (
            <div className={showInSidebar ? "" : "mb-12"}>
                <h2 className={`font-bold mb-6 flex items-center ${showInSidebar ? "text-lg" : "text-2xl"}`}>
                    <TrendingUp className={`mr-2 text-red-600 dark:text-red-500 ${showInSidebar ? "h-5 w-5" : "h-6 w-6"}`} />
                    Trending now
                </h2>
                <div className={showInSidebar ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {Array.from({ length: showInSidebar ? 5 : limit }).map((_, i) =>
                        showInSidebar ? (
                            <div key={i} className="flex space-x-3">
                                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ) : (
                            <PostCardSkeleton key={i} />
                        ),
                    )}
                </div>
            </div>
        )
    }

    if (showInSidebar) {
        return (
            <div>
                <h2 className="text-lg font-bold mb-6 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                    Trending now
                </h2>
                <div className="space-y-4">
                    {trendingPosts.slice(0, 5).map((post, index) => (
                        <div key={post.id} className="flex space-x-3 group">
                            <div className="flex-shrink-0">
                                <Badge
                                    variant="destructive"
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                >
                                    {index + 1}
                                </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                                <a href={`/post/${post.id}/${post.slug}`} className="block">
                                    <h3 className="text-sm font-medium group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2 mb-1">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                                        <span>{post.views.toLocaleString()} views</span>
                                        <span>•</span>
                                        <span>{post.likes.length} likes</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-red-600 dark:text-red-500" />
                Trending now
            </h2>
            <div className="space-y-3">
                {trendingPosts.map((post, index) => (
                    <div key={post.id} className="relative">
                        <div className="absolute top-3 right-3 z-10">
                            <Badge variant="destructive" className="font-bold">
                                #{index + 1}
                            </Badge>
                        </div>
                        <PostCard post={post} showViews={true} compact={true} last={trendingPosts.length === index + 1} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PopularThisWeek() {
    const [popularPosts, setPopularPosts] = useState<TypeGetAllPublishedPosts>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setTimeout(async () => {
            const posts = await getPopularThisWeek(6)
            setPopularPosts(posts)
            setIsLoading(false)
        }, 350)
    }, [])

    if (isLoading) {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Clock className="h-6 w-6 mr-2 text-green-600 dark:text-green-500" />
                    Popular this week
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <PostCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    if (popularPosts.length === 0) return null

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-green-600 dark:text-green-500" />
                Popular this week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPosts.map((post) => (
                    <PostCard key={post.id} post={post} showViews={true} />
                ))}
            </div>
        </div>
    )
}
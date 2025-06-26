import { ImageWithSkeleton } from "../loading/image-skeleton";
import { Eye, MessageCircle, Clock } from "lucide-react";
import { TypeGetAllPublishedPosts } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostCardProps {
    post: TypeGetAllPublishedPosts[number],
    featured?: boolean,
    sideFeatured?: boolean,
    side?: 'left' | 'right' | 'top' | 'bottom',
    showViews?: boolean,
    showLike?: boolean,
    showComments?: boolean,
    showAuthor?: boolean,
    compact?: boolean,
    horizontal?: boolean,
    last?: boolean
}

export default function PostCard({
    post,
    featured = false,
    sideFeatured = false,
    side = 'bottom',
    showViews = false,
    // showLike = false,
    showComments = false,
    showAuthor = true,
    compact = false,
    last = false,
    horizontal = false,
}: PostCardProps) {
    // Defensive programming - ensure post and required fields exist
    if (!post) {
        console.warn("PostCard: post prop is undefined")
        return null
    }

    const { id, slug, title, thumbnail, content, summary, category, author, publishedAt, views } = post;

    // Featured post - large hero style
    if (featured) {
        return (
            <Link href={`/post/${id}/${slug}`} className="block group">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg rounded-md !p-0 !m-0">
                    <div className="relative overflow-hidden rounded-md">
                        <ImageWithSkeleton
                            src={thumbnail || "/placeholder.svg"}
                            alt={title || "Post image"}
                            fill
                            aspectRatio="video"
                            className="group-hover:scale-105 transition-transform duration-300 rounded-md"
                            priority
                        />
                        <div className="absolute top-4 left-4">
                            <Badge variant="destructive" className="font-semibold">
                                {category?.name || "Uncategorized"}
                            </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight line-clamp-2">
                                {title || "Untitled Post"}
                            </h1>
                            <p className="text-sm md:text-base opacity-90 line-clamp-2 mb-3 hidden sm:block">
                                {summary || "No summary available"}
                            </p>
                            <div className="flex items-center text-sm space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6 border-2 border-white">
                                        <Image
                                            width={144}
                                            height={144}
                                            alt={author?.firstName.charAt(0) || "U"}
                                            src={author?.imageUrl || "/defaultProfilePic.svg"}
                                            className="aspect-square size-full"
                                        />
                                    </Avatar>
                                    <span className="font-medium">{author?.firstName || 'Unknown'} {author?.lastName || 'Author'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" size={18} />
                                    <span>
                                        {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                                    </span>
                                </div>
                                {showViews && (
                                    <div className="flex items-center space-x-1">
                                        <Eye className="h-4 w-4" size={18} />
                                        <span>{(views / 1000).toFixed(1)}k</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        )
    }

    if (sideFeatured) {
        return (
            <Link
                href={`/post/${id}/${slug}`}
                className={cn("block group pb-2",
                    last ? '' : 'border-b border-separate'
                )}
            >
                <div className={cn("w-full h-full flex overflow-hidden gap-8 transition-all duration-300 border-0 !p-0 !m-0",
                    side === 'left' && 'md:flex-row-reverse items-center flex-col',
                    side === 'right' && 'md:flex-row items-center flex-col',
                    side === 'top' && 'md:flex-col-reverse flex-col',
                    side === 'bottom' && 'flex-col',
                )}>
                    <div className="relative overflow-hidden min-w-[90vw] md:min-w-[50vw] aspect-video object-cover rounded-sm">
                        <ImageWithSkeleton
                            src={thumbnail || "/placeholder.svg"}
                            alt={title || "Post image"}
                            fill
                            aspectRatio="video"
                            className="group-hover:scale-105 transition-transform duration-300 rounded-sm"
                            priority
                        />
                        <div className="absolute top-4 left-4">
                            <Badge variant="destructive" className="font-semibold rounded-md">
                                {category?.name || "Uncategorized"}
                            </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>

                    <div className="text-foreground w-full md:w-fit flex flex-col items-start justify-between">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight">
                            {title || "Untitled Post"}
                        </h1>
                        <p className="text-sm md:text-base opacity-90 line-clamp-2 mb-3">
                            {content || "No content available"}
                        </p>

                        <div className="flex items-start gap-2 text-sm space-x-4 text-foreground/75">
                            <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" size={18} />
                                <span>
                                    {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                                </span>
                            </div>
                            {showViews && (
                                <div className="flex items-center space-x-1">
                                    <Eye className="h-4 w-4" size={18} />
                                    <span>{(views / 1000).toFixed(1)}k</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link >
        )
    }

    // Compact sidebar style
    if (compact) {
        return (
            <Link
                href={`/post/${id}/${slug}`}
                className={cn("block group",
                    last ? '' : 'border-b border-separate'
                )}
            >
                <div className="flex space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-shrink-0">
                        <ImageWithSkeleton
                            src={thumbnail || "/placeholder.svg"}
                            alt={title || "Post image"}
                            width={60}
                            height={45}
                            aspectRatio="square"
                            fill
                            className="w-[60px] h-[45px] rounded"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors line-clamp-2 mb-1 leading-tight">
                            {title || "Untitled Post"}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground space-x-2">
                            <span>
                                {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                            </span>
                            {showViews && (
                                <>
                                    <span>•</span>
                                    <span>{(views / 1000).toFixed(1)}k</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    if (horizontal) {
        return (
            <Link
                href={`/post/${id}/${slug}`}
                className={cn("block group",
                    last ? '' : 'border-b border-separate'
                )}
            >
                <div className="flex space-x-4 p-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <ImageWithSkeleton
                                src={thumbnail || "/placeholder.svg"}
                                alt={title || "Post image"}
                                width={120}
                                height={120}
                                fill
                                aspectRatio="square"
                                className="sm:w-[120px] sm:h-[120px] w-[96px] h-[96px] aspect-square rounded-sm object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge variant="destructive" className="absolute top-1 left-1 text-xs px-1.5 py-0.5 font-medium">
                                {category?.name || "Uncategorized"}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-foreground mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors line-clamp-4 sm:line-clamp-2 leading-tight text-base">
                                {title || "Untitled Post"}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-3 leading-relaxed">
                                {content || "No content available"}
                            </p>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-3">
                                {showAuthor && (
                                    <div className="hidden sm:flex items-center space-x-1">
                                        <Avatar className="h-6 w-6 border-2 border-white">
                                            <Image
                                                width={144}
                                                height={144}
                                                alt={author?.firstName.charAt(0) || "U"}
                                                src={author?.imageUrl || "/defaultProfilePic.svg"}
                                                className="aspect-square size-full"
                                            />
                                        </Avatar>
                                        <span className="font-medium">{author?.firstName || 'Unknown'} {author?.lastName || 'Author'}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" size={18} />
                                    <span>
                                        {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            {(showComments || showViews) && (
                                <div className="flex items-center space-x-3">
                                    {showViews && (
                                        <div className="flex items-center space-x-1">
                                            <Eye className="h-4 w-4" size={18} />
                                            <span>{(views / 1000).toFixed(1)}k</span>
                                        </div>
                                    )}
                                    {showComments && (
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="h-4 w-4" size={18} />
                                            <span>12</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link >
        )
    }

    // Default responsive layout, desktop: vertical, mobile: horizontal.
    return (
        <Link
            href={`/post/${id}/${slug}`}
            className={cn("block group md:max-w-[256px] md:flex-grow basis-[100%] mb-3",
                last ? '' : 'border-b border-separate'
            )}
        >
            <div className="flex md:flex-col md:gap-2 space-x-4 sm:p-4 py-4">
                {/* Image */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <ImageWithSkeleton
                            src={thumbnail || "/placeholder.svg"}
                            alt={title || "Post image"}
                            width={120}
                            height={120}
                            fill
                            aspectRatio="square"
                            className="md:w-[256px] md:h-[120px] w-[96px] h-[96px] aspect-square rounded-sm md:rounded-[2px] object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge variant="destructive" className="absolute top-1 left-1 text-xs px-1.5 py-0.5 font-medium">
                            {category?.name || "Uncategorized"}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-500 transition-colors line-clamp-4 md:line-clamp-3 leading-tight text-base">
                            {title || "Untitled Post"}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mb-3 leading-relaxed">
                            {content || "No content available"}
                        </p>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex md:flex-col items-center md:items-start md:gap-2 space-x-3">
                            {showAuthor && (
                                <div className="hidden sm:flex items-center space-x-1">
                                    <Avatar className="h-6 w-6 border-2 border-white">
                                        <Image
                                            width={144}
                                            height={144}
                                            alt={author?.firstName.charAt(0) || "U"}
                                            src={author?.imageUrl || "/defaultProfilePic.svg"}
                                            className="aspect-square size-full"
                                        />
                                    </Avatar>
                                    <span className="font-medium">{author?.firstName || 'Unknown'} {author?.lastName || 'Author'}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" size={18} />
                                <span>
                                    {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                                </span>
                            </div>
                        </div>

                        {(showComments || showViews) && (
                            <div className="flex items-center space-x-3">
                                {showViews && (
                                    <div className="flex items-center space-x-1">
                                        <Eye className="h-4 w-4" size={18} />
                                        <span>{(views / 1000).toFixed(1)}k</span>
                                    </div>
                                )}
                                {showComments && (
                                    <div className="flex items-center space-x-1">
                                        <MessageCircle className="h-4 w-4" size={18} />
                                        <span>12</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link >
    );
};
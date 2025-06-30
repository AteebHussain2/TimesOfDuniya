"use client"

import { IncrementPostViews } from "@/actions/site/views/increamentPostViews";
import { getLikeTracker, getViewTracker } from "@/lib/view-tracking";
import { TogglePostLike } from "@/actions/site/likes/togglePostLike";
import { Heart, Eye, Share2, MessageCircle } from "lucide-react";
import ReactCountUpWrapper from "../ReactCountUpWrapper";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PostEngagementProps {
    postId: number
    postSlug: string
    initialViews: number
    initialLikes: number
    initialCommentCount: number
    showInline?: boolean
}

export default function PostEngagement({
    postId,
    postSlug,
    initialViews,
    initialLikes,
    initialCommentCount,
    showInline = false,
}: PostEngagementProps) {
    const [views, setViews] = useState(initialViews)
    const [likes, setLikes] = useState(initialLikes)
    const [commentCount] = useState(initialCommentCount)
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        const monitorViews = async () => {
            const likeTracker = getLikeTracker();
            const viewTracker = getViewTracker();

            setIsLiked(likeTracker.hasLiked(postId));

            const alreadyViewed = viewTracker.hasViewed(postId);

            if (!alreadyViewed) {
                const wasNewView = viewTracker.markAsViewed(postId)
                if (wasNewView) {
                    await IncrementPostViews(postId, postSlug)
                    setViews((prev) => prev + 1)
                };
            };
        };

        monitorViews();
    }, [postId, postSlug]);

    const handleLike = async () => {
        const likeTracker = getLikeTracker()
        const newLikeState = likeTracker.toggleLike(postId)

        setIsLiked(newLikeState)

        if (newLikeState) {
            await TogglePostLike(postId, postSlug, true)
            setLikes((prev) => prev + 1)
        } else {
            setLikes((prev) => Math.max(0, prev - 1))
            await TogglePostLike(postId, postSlug, false)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Times Of Duniya Article",
                    url: window.location.href,
                });
                toast.info('Link Copied to Clipboard!', { id: 'toast-copy' });
            } catch (err) {
                console.log("Error sharing:", err)
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.info('Link Copied to Clipboard!', { id: 'toast-copy' });
        }
    }

    if (showInline) {
        return (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <ReactCountUpWrapper value={views} />
                </div>
                <div className="flex items-center space-x-1">
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current text-rose-600" : ""}`} />
                    <ReactCountUpWrapper value={likes} />
                </div>
                <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <ReactCountUpWrapper value={commentCount} />
                </div>
            </div>
        )
    }

    return (
        <div className="py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Eye className="h-5 w-5" />
                        <ReactCountUpWrapper value={views} />
                        {/* <span className="text-sm font-medium sm:hidden">{views.toLocaleString()}</span> */}
                        {/* <span className="text-sm font-medium hidden sm:block">{views.toLocaleString()} Views</span> */}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`${isLiked ? "text-rose-600 hover:text-rose-700" : ""}`}
                    >
                        <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                        <ReactCountUpWrapper value={likes} />
                        {/* <span className="sm:hidden">{likes.toLocaleString()}</span>
                        <span className="hidden sm:block">{likes.toLocaleString()} Likes</span> */}
                    </Button>

                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <MessageCircle className="h-5 w-5" />
                        <ReactCountUpWrapper value={commentCount} />
                        {/* <span className="text-sm font-medium sm:hidden">{commentCount}</span>
                        <span className="text-sm font-medium hidden sm:block">{commentCount} Comments</span> */}
                    </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                </Button>
            </div>
            <Separator className="mt-4" />
        </div>
    );
};
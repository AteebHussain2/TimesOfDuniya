"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageCircle, Heart, Reply, Send, ArrowUpDown, Loader2Icon } from "lucide-react";
import { GetCommentsByPostId } from "@/actions/site/comments/getCommentsByPostId";
import { GetUserDataByUserId } from "@/actions/dashboard/getUserDataByUserId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToggleCommentLike } from "@/actions/site/likes/toggleCommentLike";
import { userRoleColor, UserRoles } from "@/lib/users/userRole";
import { AddComment } from "@/actions/site/comments/addComment";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddReply } from "@/actions/site/comments/addReply";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypeGetCommentByPostId } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Image } from "@imagekit/next";
import { Role } from "@prisma/client";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CommentSectionProps {
    postId: number
    postSlug: string
}

interface ReplyProps {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    postId: number;
    authorId: string;
    parentId: number | null;
}

interface CommentItemProps {
    comment: TypeGetCommentByPostId[number],
    reply?: ReplyProps,
    depth?: number,
    postId: number,
    postSlug: string,
    userId: string,
}

function CommentItem({ comment, depth = 0, postId, postSlug, userId }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState("")

    const queryClient = useQueryClient();
    const { mutate: replyToComment, isPending: isReplying } = useMutation({
        mutationFn: ({ parentId, content, }: { parentId: number; content: string; }) => AddReply(postId, postSlug, parentId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Reply posted!");
        },
        onError: () => toast.error("Failed to reply."),
    });

    const { mutate: toggleLike, isPending: isLiking } = useMutation({
        mutationFn: (commentId: number) => ToggleCommentLike(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        },
        onError: () => toast.error("Failed to like comment."),
    })

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!replyContent.trim()) return;

        replyToComment({
            parentId: comment.id,
            content: replyContent,
        });

        setReplyContent("");
        setShowReplyForm(false);
    };

    const isLiked = comment.likes.some(like => like.userId === userId)
    const maxDepth = 0

    return (
        <div className={`${depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
            <div className="mb-4 p-4">
                <div className="flex items-start space-x-3 mb-3">
                    <Avatar className="h-8 w-8 border-2 border-white">
                        <Image
                            width={144}
                            height={144}
                            alt={comment.author?.firstName.charAt(0) || "U"}
                            src={comment.author?.imageUrl || "/defaultProfilePic.svg"}
                            className="aspect-square size-full object-cover"
                        />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col items-start space-x-2 mb-1">
                            <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-sm">{comment.author.firstName} {comment.author.lastName}</h4>
                                {comment.author?.role !== UserRoles.MEMBER && (
                                    <Badge
                                        variant={'secondary'}
                                        className={cn("text-[0.6rem] pb-[3px] font-semibold border-0",
                                            userRoleColor[comment.author?.role as Role]
                                        )}>
                                        {comment.author?.role}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground text-xs">@{comment.author.username}</span>
                                <span className="text-muted-foreground text-xs">•</span>
                                <span className="text-muted-foreground text-xs">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed">{comment.content}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 ml-12">
                    <SignedIn>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isLiking}
                            onClick={() => toggleLike(comment.id)}
                            className={`h-8 px-2 ${isLiked ? "text-rose-600 hover:text-rose-700" : ""}`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                            <span className="text-xs">{comment.likes.length}</span>
                        </Button>
                    </SignedIn>
                    <SignedOut>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={true || isLiking}
                            onClick={() => toggleLike(comment.id)}
                            className={`h-8 px-2 ${isLiked ? "text-rose-600 hover:text-rose-700" : ""}`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                            <span className="text-xs">{comment.likes.length}</span>
                        </Button>
                    </SignedOut>

                    {depth < maxDepth && (
                        <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)} className="h-8 px-2">
                            <Reply className="h-4 w-4 mr-1" />
                            <span className="text-xs">Reply</span>
                        </Button>
                    )}
                </div>

                {showReplyForm && (
                    <>
                        <SignedIn>
                            <form onSubmit={handleReplySubmit} className="mt-4 ml-12">
                                <div className="flex space-x-3">
                                    <Avatar className="h-8 w-8 border-2 border-white">
                                        <Image
                                            width={144}
                                            height={144}
                                            alt={comment.author?.firstName.charAt(0) || "U"}
                                            src={comment.author?.imageUrl || "/defaultProfilePic.svg"}
                                            className="aspect-square size-full object-cover"
                                        />
                                    </Avatar>
                                    <div className="flex-1">
                                        <Textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder={`Reply to @${comment.author.username}...`}
                                            className="resize-none"
                                            rows={2}
                                        />
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" size="sm" disabled={!replyContent.trim() || isReplying}>
                                                {isReplying ? (
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                                ) : (
                                                    <Send className="h-3 w-3 mr-1" />
                                                )}
                                                {isReplying ? "Posting..." : "Reply"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </SignedIn>
                        <SignedOut>
                            <div
                                onClick={() => toast.error("You must be signed in to reply.")}
                                className="mt-4 ml-12 cursor-not-allowed opacity-60"
                            >
                                <Textarea disabled placeholder="Sign in to reply..." />
                            </div>
                        </SignedOut>
                    </>
                )}
            </div>
        </div>
    )
}

const CommentSkeleton = ({ showReplies, replyCount }: { showReplies?: boolean; replyCount?: number }) => {
    return (
        <div className="space-y-4">
            <div className="flex space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                </div>
            </div>
            {showReplies && (
                <div className="ml-8 border-l-2 border-muted pl-4 space-y-4">
                    {Array.from({ length: replyCount || 1 }).map((_, i) => (
                        <div className="flex space-x-3" key={i}>
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-muted rounded w-1/4" />
                                <div className="h-3 bg-muted rounded" />
                                <div className="h-3 bg-muted rounded w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CommentSection({ postId, postSlug }: CommentSectionProps) {
    const [newComment, setNewComment] = useState("");
    const [sortBy, setSortBy] = useState<'desc' | 'asc'>("desc");

    const queryClient = useQueryClient();

    const { user } = useUser();
    const { data: userData } = useQuery({
        queryKey: ['user', user?.id],
        queryFn: () => GetUserDataByUserId(),
        enabled: !!user?.id,
    });

    const { mutate: commentMutate, isPending } = useMutation({
        mutationFn: ({ postId, newComment, postSlug }: { postId: number; newComment: string; postSlug: string }) => AddComment(postId, newComment, postSlug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            setNewComment("")
        },
        onError: () => toast.error("Failed to comment.", { id: 'post-comment' }),
    })

    const { data: comments, isPending: isLoading } = useQuery({
        queryKey: ['comments', postId, sortBy],
        queryFn: () => GetCommentsByPostId(Number(postId), sortBy),
    });

    const getSortLabel = (sort: string) => {
        switch (sort) {
            case "desc":
                return "Newest First"
            case "asc":
                return "Oldest First"
            default:
                return "Newest First"
        }
    }

    const totalComments = comments ? comments.reduce((total) => total + 1, 0) : 0

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5 text-muted-foreground" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>

                    <div className="mb-8">
                        <div className="flex space-x-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-20 w-full mb-3" />
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <CommentSkeleton key={i} showReplies={i === 1} replyCount={2} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Comments ({totalComments})</h3>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                {getSortLabel(sortBy)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {["desc", "asc"].map((option) => (
                                <DropdownMenuItem
                                    key={option}
                                    onClick={() => setSortBy(option as 'asc' | 'desc')}
                                    className={sortBy === option ? "bg-accent" : ""}
                                >
                                    {getSortLabel(option)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <SignedIn>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            commentMutate({ postId: Number(postId), newComment, postSlug })
                        }}
                        className="mb-8"
                    >
                        <div className="flex space-x-3">
                            <Avatar className="h-8 w-8 border-2 border-white">
                                <Image
                                    width={144}
                                    height={144}
                                    alt={userData?.firstName.charAt(0) || "U"}
                                    src={userData?.imageUrl || "/defaultProfilePic.svg"}
                                    className="aspect-square size-full object-cover"
                                />
                            </Avatar>
                            <div className="flex-1">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="resize-none"
                                    rows={3}
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-xs text-muted-foreground">
                                        Commenting as <span className="font-medium">@{userData?.username}</span>
                                    </p>
                                    <Button type="submit" disabled={!newComment.trim() || isPending}>
                                        {isPending ? (
                                            <Loader2Icon className="animate-spin h-4 w-4 mr-2 text-white" />
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        {isPending ? "Posting..." : "Post Comment"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </SignedIn>

                <SignedOut>
                    <div
                        onClick={() => toast.error("You must be signed in to comment.")}
                        className="mb-8 cursor-not-allowed"
                    >
                        <div className="flex space-x-3 opacity-60">
                            <Avatar />
                            <Textarea disabled placeholder="Sign in to comment..." />
                        </div>
                    </div>
                </SignedOut>

                <Separator className="mb-6" />

                <div className="space-y-4">
                    {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} postId={postId} postSlug={postSlug} userId={userData?.id || ''} />
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <MessageCircle className="h-12 w-12 text-muted mx-auto mb-3" />
                            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    )
}
"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Edit, BarChart3, MessageSquare, Trash2, FileText, MoreVertical, User2, Globe2Icon, } from "lucide-react";
import { ImageWithSkeleton } from "@/components/loading/image-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import TooltipWrapper from "@/components/TooltipWrapper";
import PostDeleteDialog from "./PostDeleteDialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { TypeGetAllPosts } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";

interface Props {
  post: TypeGetAllPosts[number]
  viewMode: "grid" | "list"
}

const PostCard = ({ post, viewMode }: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { published, id, slug, title, content, thumbnail, author, views, createdAt, updatedAt } = post;

  const isPublished = published
  const formattedDate = formatDistanceToNow(updatedAt || createdAt, { addSuffix: true });

  if (viewMode === "list") {
    return (
      <>
        <PostDeleteDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} post={post} />

        <Card className="!p-0 hover:shadow-md rounded-sm sm:rounded-lg transition-shadow">
          <CardContent className="sm:!p-4 !p-2 rounded-sm sm:rounded-lg">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <ImageWithSkeleton
                  src={thumbnail || "/placeholder.svg"}
                  alt={title || "Post image"}
                  width={120}
                  height={80}
                  fill
                  aspectRatio="video"
                  className="w-[120px] h-[80px] aspect-square rounded-sm object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/post/${id}/${slug}`}
                      target="_blank"
                      className="text-sm sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-3 sm:line-clamp-2"
                    >
                      {title}
                    </Link>

                    <div className="hidden sm:block">
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{content}</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User2 size={14} />
                        <span>@{author.username}</span>
                      </div>

                      <div className="flex flex-row lg:items-center items-start gap-2">
                        <div className="flex items-center gap-1 text-xs text-shadow-muted-foreground">
                          <span>{views.length || 0} views</span>

                          <span>•</span>

                          <span>{formattedDate}</span>
                        </div>

                        {isPublished ? (
                          <>
                            <Globe2Icon size={14} className="min-h-4 min-w-4 sm:hidden inline" />
                          </>
                        ) : (
                          <>
                            <FileText size={14} className="min-h-4 min-w-4 sm:hidden inline" />
                          </>
                        )}

                        <Badge
                          className="hidden sm:flex items-center gap-1"
                          variant={isPublished ? "default" : "secondary"}
                        >
                          {isPublished ? (
                            <>
                              <Globe2Icon className="h-3 w-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <FileText className="h-3 w-3" />
                              Draft
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-3">
                    <PostActions postId={id} postSlug={slug} onDelete={() => setShowDeleteDialog(true)} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card >
      </>
    )
  }

  // Grid view
  return (
    <>
      <PostDeleteDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} post={post} />

      <Card className="!p-0 group hover:shadow-lg transition-all duration-300">
        <CardContent className="!p-0 w-full">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <ImageWithSkeleton
              src={thumbnail || "/defaultProfilePic.svg"}
              alt={slug}
              width={400}
              height={225}
              fill
              aspectRatio="video"
              className="w-full h-full rounded-sm object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? (
                  <>
                    <Globe2Icon className="h-3 w-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <FileText className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>

            {/* Actions Overlay */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <PostActions postId={id} postSlug={slug} onDelete={() => setShowDeleteDialog(true)} variant="overlay" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 w-full flex flex-col items-start justify-between">
            <div className="max-h-[138px] sm:max-h-[168px] min-h-[138px] sm:min-h-[168px] w-full h-full">
              <Link
                href={`/post/${id}/${slug}`}
                target="_blank"
                className="sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-3 mb-2"
              >
                {title}
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4">{content}</p>
            </div>

            {/* Author and Meta */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User2 size={14} />
                <span className="text-xs sm:text-sm text-muted-foreground">@{author.username}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{views.length || 0} views</span>
                <span>•</span>
                <span>{formattedDate}</span>

                <PostActions postId={id} postSlug={slug} onDelete={() => setShowDeleteDialog(true)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Separate component for actions to keep code clean
const PostActions = ({
  postId,
  postSlug,
  onDelete,
  variant = "default",
}: {
  postId: number,
  postSlug: string,
  onDelete: () => void
  variant?: "default" | "overlay"
}) => {
  if (variant === "overlay") {
    return (
      <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
        <TooltipWrapper content="Edit Post">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/content/edit/${postId}/${postSlug}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Analytics">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/content/analytics/${postId}/${postSlug}`}>
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Comments">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/comments/${postId}/${postSlug}`}>
              <MessageSquare className="h-4 w-4" />
            </Link>
          </Button>
        </TooltipWrapper>

        <TooltipWrapper content="Delete Post">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </TooltipWrapper>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/content/edit/${postId}/${postSlug}`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Post
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/analytics/${postId}/${postSlug}`}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/comments/${postId}/${postSlug}`}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2 text-destructive" />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PostCard

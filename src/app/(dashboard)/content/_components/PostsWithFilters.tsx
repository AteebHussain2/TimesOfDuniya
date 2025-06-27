'use client'

import { ChartColumn, EditIcon, Globe2Icon, MessageSquareMoreIcon, SaveIcon, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PostDeleteDialog from "./PostDeleteDialog";
import { Button } from "@/components/ui/button";
import { TypeGetAllPosts } from "@/lib/types";
import { Image } from "@imagekit/next";
import { formatDate } from "date-fns";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Props {
    posts: TypeGetAllPosts,
};

const PostsWithFilters = ({ posts }: Props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDialog, setShowDialog] = useState(false)
    const [post, setPost] = useState<TypeGetAllPosts[number]>()

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <PostDeleteDialog
                open={showDialog}
                setOpen={setShowDialog}
                post={post}
            />

            <div className="w-full border-t border-separate">
                <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md mb-4"
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20px] !text-sm !text-muted-foreground">Sr.</TableHead>
                            <TableHead className="!text-sm !text-muted-foreground">Post</TableHead>
                            <TableHead className="w-[128px] text-left !text-sm !text-muted-foreground">Status</TableHead>
                            <TableHead className="w-[128px] text-left !text-sm !text-muted-foreground">Restrictions</TableHead>
                            <TableHead className="w-[128px] text-left !text-sm !text-muted-foreground">Date</TableHead>
                            <TableHead className="w-[64px] text-left !text-sm !text-muted-foreground">Views</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredPosts.map((post: TypeGetAllPosts[number], index: number) => (
                            <TableRow key={post.id} className="group">
                                <TableCell className="border-r border-separate text-muted-foreground">
                                    {index + 1}.
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-start gap-2 overflow-hidden">
                                        <Image
                                            className="aspect-video object-cover rounded-md"
                                            src={post.thumbnail}
                                            alt={post.slug}
                                            width={120}
                                            height={80}
                                            quality={20}
                                            loading="lazy"
                                            placeholder={"blur"}
                                            blurDataURL={post.thumbnail}
                                        />

                                        <span className="max-w-[400px] pt-2 transition-all">
                                            <Link
                                                className="text-md font-semibold truncate hover:underline"
                                                href={`/${post.id}/${post.slug}`}
                                                target="_blank"
                                            >
                                                {post.title}
                                            </Link>

                                            <p className="group-hover:hidden text-sm text-muted-foreground truncate transition-all">
                                                {post.content}
                                            </p>

                                            <div className="hidden group-hover:flex items-center gap-2 transition-all pt-[4px]">
                                                <Button
                                                    className=""
                                                    variant={"ghost"}
                                                    size={'sm'}
                                                >
                                                    <Link
                                                        href={`/content/edit/${post.id}/${post.slug}`}
                                                    >
                                                        <EditIcon size={16} className="size-[16px] stroke-primary" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    className=""
                                                    variant={"ghost"}
                                                    size={'sm'}
                                                >
                                                    <Link
                                                        href={`/content/analytics/${post.id}/${post.slug}`}
                                                    >
                                                        <ChartColumn size={16} className="size-[16px] stroke-primary" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    className=""
                                                    variant={"ghost"}
                                                    size={'sm'}
                                                >
                                                    <Link
                                                        href={`/comments/${post.id}/${post.slug}`}
                                                    >
                                                        <MessageSquareMoreIcon size={16} className="size-[16px] stroke-primary" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    className=""
                                                    variant={"ghost"}
                                                    size={'sm'}
                                                    onClick={() => {
                                                        setPost(post)
                                                        setShowDialog(true)
                                                    }}
                                                >
                                                    <TrashIcon size={16} className="size-[16px] stroke-destructive" />
                                                </Button>
                                            </div>
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    {post.published ? (
                                        <span className="flex items-center justify-start gap-1">
                                            <Globe2Icon size={16} className="text-muted-foreground" />
                                            <span>Public</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-start gap-1">
                                            <SaveIcon size={16} className="text-muted-foreground" />
                                            <span>Draft</span>
                                        </span>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        @{post.author.username}
                                    </p>
                                </TableCell>

                                <TableCell>
                                    TODO
                                </TableCell>

                                <TableCell>
                                    {formatDate(post?.updatedAt || post?.createdAt, 'dd MMM yyyy')}
                                </TableCell>

                                <TableCell>
                                    {post.views.length || 0}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table >
            </div >
        </>
    )
}

export default PostsWithFilters

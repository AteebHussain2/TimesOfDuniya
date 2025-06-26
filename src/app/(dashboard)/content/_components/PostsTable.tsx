'use client';

import { ChartColumn, EditIcon, Globe2Icon, MessageSquareMoreIcon, SaveIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import PostDeleteDialog from "./PostDeleteDialog";
import { TypeGetCategories } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypeGetAllPosts } from "@/lib/types";
import { Image } from "@imagekit/next";
import { formatDate } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
    categories: TypeGetCategories,
    posts: TypeGetAllPosts,
}

const PostsTable = ({ categories, posts }: Props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDialog, setShowDialog] = useState(false)
    const [post, setPost] = useState<TypeGetAllPosts[number]>()

    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';

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

            <div className="w-screen md:w-[calc(100vw-280px)]">
                <div className="relative border-b border-separate">
                    <div className="max-w-[20px] w-full max-h-[30px] h-full z-10 absolute top-0 left-0 bg-gradient-to-l from-transparent to-background"></div>
                    <div className="max-w-[40px] w-full max-h-[30px] h-full z-10 absolute top-0 right-0 bg-gradient-to-r from-transparent to-background"></div>
                    <div className="px-10 overflow-x-auto hide-scrollbar flex items-center gap-7 text-muted-foreground font-semibold">
                        <Link
                            href={`/content`}
                            className={cn("min-w-[40px] text-center cursor-pointer border-b-3 border-transparent transition-all pb-4",
                                (selectedCategory === '' || !selectedCategory) ? 'text-primary border-primary' : 'hover:border-muted-foreground'
                            )}
                        >
                            All
                        </Link>
                        {categories?.map((category: TypeGetCategories[number]) => (
                            <Link
                                key={category.id}
                                href={`?` + new URLSearchParams(`category=${category.slug}`).toString()}
                                className={cn("text-center cursor-pointer border-b-3 border-transparent transition-all pb-4",
                                    selectedCategory === category.slug ? 'text-primary border-primary' : 'hover:border-muted-foreground'
                                )}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full mx-8 my-4 flex items-center justify-between">
                <span className="relative">
                    <Input
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:min-w-md pl-10"
                    />

                    <SearchIcon size={34} className="absolute top-0 left-0 p-2 text-muted-foreground border-r border-separate" />
                </span>
            </div>

            <div className="w-full border-t border-separate">
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
                                                <p className="truncate">{post.title}</p>
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
                                    {post.views || 0}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table >
            </div >
        </>
    )
}

export default PostsTable;
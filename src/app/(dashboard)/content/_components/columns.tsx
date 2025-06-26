"use client";

import { ChartColumn, EditIcon, Globe2Icon, MessageSquareMoreIcon, SaveIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { TypeGetAllPosts } from "@/lib/types"
import { Image } from "@imagekit/next";
import { formatDate } from "date-fns";
import Link from "next/link";

export const columns: ColumnDef<TypeGetAllPosts[number]>[] = [
    {
        accessorKey: "id",
        header: () => <div className="!max-w-[20px]">Id.</div>,
    },
    {
        accessorKey: "title",
        header: () => <div className="">Posts</div>,
        cell: ({ row }) => {
            const post = row.original;

            return (
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
                        </div>
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "published",
        header: () => <div className="w-[128px]">Status</div>,
        cell: ({ row }) => {
            const post = row.original;
            return (
                <>
                    <span className="flex items-center justify-start gap-1">
                        {post.published ? (
                            <>
                                <Globe2Icon size={16} className="text-muted-foreground" />
                                <span>Public</span>
                            </>
                        ) : (
                            <>
                                <SaveIcon size={16} className="text-muted-foreground" />
                                <span>Draft</span>
                            </>
                        )}
                    </span>
                    <p className="text-xs text-muted-foreground">
                        @{post.author.username}
                    </p>
                </>
            )
        },
    },
    {
        accessorKey: "restrictions",
        header: () => <div className="w-[128px]">Restrictions</div>,
        cell: () => 'TODO'
    },
    {
        accessorKey: "updatedAt",
        header: () => <div className="w-[128px]">Date</div>,
        cell: ({ row }) => {
            const post = row.original;
            return formatDate(post?.updatedAt || post?.createdAt, 'dd MMM yyyy')
        }
    },
    {
        accessorKey: "views",
        header: () => <div className="w-[64px]">Views</div>,
        cell: ({ row }) => row.getValue('views') || 0
    }
]
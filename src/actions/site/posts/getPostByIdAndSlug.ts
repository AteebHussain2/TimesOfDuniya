'use server';

import prisma from "@/lib/prisma";
import { Posts } from "./getFirstPost";

export async function GetPostByIdAndSlug(id: number, slug: string): Promise<Posts> {
    return await prisma.post.findUnique({
        where: {
            id,
            slug,
        },
        include: {
            tags: true,
            category: true,
            author: true,
            views: true,
            likes: true,
            comments: true,
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    }) as Posts;
};
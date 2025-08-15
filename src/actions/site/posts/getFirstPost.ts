'use server';

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export type Posts = Prisma.PostGetPayload<{
    include: {
        category: true,
        tags: true,
        author: true,
        views: true,
        comments?: true,
        likes?: true
    },
}>;

export async function GetFirstPost(): Promise<Posts> {
    return await prisma.post.findFirst({
        where: {
            published: true,
            publishedAt: {
                not: null
            },
        },
        include: {
            category: true,
            author: true,
            tags: true,
            likes: true,
            views: true,
            comments: true,
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    }) as Posts;
};
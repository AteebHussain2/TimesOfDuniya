'use server'

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type GetAllPublishedPosts = Prisma.PostGetPayload<{
    include: {
        author: true,
        category: true,
        tags: true,
        likes: true,
        views: true,
        comments: true,
    }
}>;

export async function GetAllPublishedPosts(): Promise<GetAllPublishedPosts[]> {
    return await prisma.post.findMany({
        orderBy: {
            publishedAt: 'desc'
        },
        where: {
            published: true,
            publishedAt: {
                not: null
            },
        },
        include: {
            author: true,
            category: true,
            tags: true,
            likes: true,
            views: true,
            comments: true,
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    }) as GetAllPublishedPosts[];
}
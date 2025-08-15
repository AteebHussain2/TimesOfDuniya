'use server';

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type GetLatestPosts = Prisma.PostGetPayload<{
    include: {
        category: true,
        tags: true,
        author: true,
        views: true,
    },
}>;

export async function GetLatestPosts(): Promise<GetLatestPosts[]> {
    return await prisma.post.findMany({
        where: {
            published: true,
            publishedAt: {
                not: null
            },
        },
        orderBy: {
            publishedAt: 'desc'
        },
        include: {
            category: true,
            author: true,
            tags: true
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 },
        take: 10,
    }) as GetLatestPosts[];
};
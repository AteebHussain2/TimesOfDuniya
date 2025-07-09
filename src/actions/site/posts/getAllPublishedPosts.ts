'use server'

import prisma from "@/lib/prisma";

export async function GetAllPublishedPosts() {
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
        // cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60 },
    });
}
'use server';

import prisma from "@/lib/prisma";

export async function GetPostsByAuthor(username: string) {
    return await prisma.post.findMany({
        where: {
            author: {
                username,
            },
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
        cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60 },
    });
};
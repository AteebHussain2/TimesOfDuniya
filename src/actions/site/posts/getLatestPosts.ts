'use server';

import prisma from "@/lib/prisma";

export async function GetLatestPosts() {
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
    });
};
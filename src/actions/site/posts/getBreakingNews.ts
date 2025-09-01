'use server';

import prisma from "@/lib/prisma";

export async function GetBreakingNews() {
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
        cacheStrategy: { swr: 10, ttl: 10, tags: ['breakingnews'] },
        take: 10,
    });
};
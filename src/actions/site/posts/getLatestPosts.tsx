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
        take: 10,
    });
};

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
        take: 10,
    });
};
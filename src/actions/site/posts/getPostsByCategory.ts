'use server';

import prisma from "@/lib/prisma";

export async function GetPostsByCategory(slug: string) {
    return await prisma.post.findMany({
        where: {
            category: {
                slug: slug,
            },
            published: true,
            publishedAt: {
                not: null,
            },
        },
        orderBy: {
            publishedAt: 'desc'
        },
        include: {
            tags: true,
            category: true,
            author: true,
            views: true,
            likes: true,
            comments: true,
        },
    });
};
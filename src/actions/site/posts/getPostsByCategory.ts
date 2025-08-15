'use server';

import { Posts } from "./getFirstPost";
import prisma from "@/lib/prisma";

export async function GetPostsByCategory(slug: string): Promise<Posts[]> {
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
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    }) as Posts[];
};
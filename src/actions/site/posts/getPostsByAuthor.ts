'use server';

import { Posts } from "./getFirstPost";
import prisma from "@/lib/prisma";

export async function GetPostsByAuthor(username: string): Promise<Posts[]> {
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
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 },
    }) as Posts[];
};
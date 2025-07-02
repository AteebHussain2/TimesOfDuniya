'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetPostByIdAndSlug(id: number, slug: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    return await prisma.post.findUnique({
        where: {
            id,
            slug,
        },
        include: {
            tags: true,
            category: true,
            author: true,
        },
        cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60 },
    });
};
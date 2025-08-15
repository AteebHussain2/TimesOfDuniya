'use server';

import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type GetPostByIdAndSlug = Prisma.PostGetPayload<{
    include: {
        tags: true,
        category: true,
        author: true,
    },
}>;

export async function GetPostByIdAndSlug(id: number, slug: string): Promise<GetPostByIdAndSlug> {
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
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 },
    }) as GetPostByIdAndSlug;
};
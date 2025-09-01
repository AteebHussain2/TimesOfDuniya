'use server';

import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type CategoryWithPosts = Prisma.CategoryGetPayload<{
    include: { posts: true }
}>;

export async function GetCategoriesWithPosts(): Promise<CategoryWithPosts[]> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const categories = await prisma.category.findMany({
        include: {
            posts: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        cacheStrategy: { swr: 10, ttl: 10, tags: ['categories', 'posts'] },
    });

    return categories as CategoryWithPosts[];
};
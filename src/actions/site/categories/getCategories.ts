'use server';

import prisma from "@/lib/prisma";

export async function GetCategories() {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60, tags: ['categories'] },
    });
}
'use server';

import prisma from "@/lib/prisma";

export async function GetCategories() {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        cacheStrategy: { swr: 10, ttl: 10, tags: ['categories'] },
    });
}
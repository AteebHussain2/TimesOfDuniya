'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetCategoriesWithPosts() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    return await prisma.category.findMany({
        include: {
            posts: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
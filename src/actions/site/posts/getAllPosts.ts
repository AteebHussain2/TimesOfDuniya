'use server'

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

type GetAllPosts = Prisma.PostGetPayload<{
    include: {
        category: true,
        tags: true,
        author: true,
    },
}>;

export async function GetAllPosts(category?: string): Promise<GetAllPosts[]> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('You are not allowed to view posts');
    };

    return await prisma.post.findMany({
        where: {
            category: {
                slug: category,
            },
        },
        orderBy: {
            updatedAt: 'desc',
        },
        include: {
            category: true,
            tags: true,
            author: true,
        },
        take: 100,
        cacheStrategy: { swr: 10, ttl: 10, tags: ['posts'] },
    }) as GetAllPosts[];
};
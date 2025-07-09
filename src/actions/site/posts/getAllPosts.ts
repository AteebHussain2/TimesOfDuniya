'use server'

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetAllPosts(category?: string) {
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
        // cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60, tags: ['posts'] },
    });
};
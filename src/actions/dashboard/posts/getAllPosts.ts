'use server'

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetAllPosts() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('You are not allowed to view posts');
    };

    if (role === UserRoles.EDITOR) {
        return await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                category: true,
                tags: true,
                author: true,
                views: true,
            },
            // cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60, tags: ['posts', 'author'] },
        });
    }

    return await prisma.post.findMany({
        orderBy: {
            updatedAt: 'desc',
        },
        include: {
            category: true,
            tags: true,
            author: true,
            views: true,
        },
        // cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60, tags: ['posts'] },
    });
};
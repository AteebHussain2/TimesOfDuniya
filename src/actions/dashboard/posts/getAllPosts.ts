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
        views: true,
    },
}>;

export async function GetAllPosts(): Promise<GetAllPosts[]> {
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
            cacheStrategy: { swr: 10, ttl: 10, tags: ['posts', 'author'] },
        }) as GetAllPosts[];
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
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60, tags: ['posts'] },
    }) as GetAllPosts[];
};
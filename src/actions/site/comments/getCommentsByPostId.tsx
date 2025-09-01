'use server'

import prisma from "@/lib/prisma";

export async function GetCommentsByPostId(postId: number, sortBy?: "asc" | "desc") {
    return await prisma.comment.findMany({
        where: { postId },
        include: {
            author: true,
            likes: true,
        },
        orderBy: {
            createdAt: sortBy ?? "desc"
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });
};
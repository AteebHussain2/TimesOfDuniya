'use server'

import prisma from "@/lib/prisma";

export async function GetCommentsByPostId(postId: number) {
    return await prisma.comment.findMany({
        where: { postId },
        include: {
            author: true,
            likes: true,
        },
        orderBy: {
            createdAt: "desc"
        },
    });
};
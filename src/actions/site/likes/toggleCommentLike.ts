"use server"

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function ToggleCommentLike(commentId: number) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthorized")
    }

    const existing = await prisma.commentLike.findFirst({
        where: {
            userId,
            commentId,
        },
    });

    if (existing) {
        await prisma.commentLike.delete({
            where: {
                id: existing.id,
            },
        })
        return { liked: false }
    } else {
        await prisma.commentLike.create({
            data: {
                userId,
                commentId,
            },
        })
        return { liked: true }
    };
};
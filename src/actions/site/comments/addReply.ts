"use server"

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function AddReply(postId: number, postSlug: string, parentId: number, content: string,) {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized")
    if (!content.trim()) throw new Error("Empty reply")

    await prisma.comment.create({
        data: {
            postId,
            content,
            authorId: userId,
        },
    });

    revalidatePath(`/post/${postId}/${postSlug}`);
};
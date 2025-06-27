'use server'

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function AddComment(postId: number, content: string, postSlug: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.comment.create({
        data: {
            postId,
            content,
            authorId: userId,
        },
    });

    revalidatePath(`/post/${postId}/${postSlug}`);
};
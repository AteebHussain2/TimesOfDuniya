'use server';

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function TogglePostLike(postId: number, postSlug: string, increament: boolean) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    if (increament) {
        await prisma.like.create({
            data: {
                postId,
                userId,
                createdAt: new Date(),
            }
        });
    } else {
        await prisma.like.delete({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
    };

    revalidatePath(`/post/${postId}/${postSlug}`);
};
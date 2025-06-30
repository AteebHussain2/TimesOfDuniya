'use server';

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function IncrementPostViews(postId: number, postSlug: string) {
    const { userId } = await auth();
    if (!userId) {
        await prisma.view.create({
            data: {
                postId,
                createdAt: new Date(),
            },
        });
    } else {
        await prisma.view.create({
            data: {
                postId,
                userId,
                createdAt: new Date(),
            },
        });
    };

    revalidatePath(`/post/${postId}/${postSlug}`);
};
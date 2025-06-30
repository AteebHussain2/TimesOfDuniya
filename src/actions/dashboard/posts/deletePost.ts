'use server';

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function DeletePost(slug: string, id: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    await prisma.post.delete({
        where: {
            slug,
            id
        },
    });

    revalidatePath('/content');
};
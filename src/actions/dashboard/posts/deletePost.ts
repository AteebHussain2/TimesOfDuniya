'use server';

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function DeletePost(slug: string, id: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.EDITOR) {
        await prisma.post.delete({
            where: {
                authorId: userId,
                slug,
                id
            },
        });
    }

    await prisma.post.delete({
        where: {
            slug,
            id
        },
    });

    revalidatePath('/content');
};
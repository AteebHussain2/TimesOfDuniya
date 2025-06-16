'use server';

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function DeleteCategory(slug: string, id: number, posts: number) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('Only Admin and Moderator are allowed to delete categories');
    }

    if (posts > 0) {
        await prisma.post.deleteMany({
            where: {
                categoryId: id,
                category: {
                    slug,
                    id,
                },
            },
        });
    };

    await prisma.category.delete({
        where: {
            slug,
            id
        },
    });

    revalidatePath('/category');
};
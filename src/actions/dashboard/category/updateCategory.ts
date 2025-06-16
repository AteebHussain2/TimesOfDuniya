'use server';

import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function UpdateCategory(slug: string, id: number, name: string, description?: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('Only Admin and Moderator are allowed to edit categories');
    }

    const newSlug = name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    await prisma.category.update({
        where: {
            slug,
            id
        },
        data: {
            name,
            slug: newSlug,
            description,
        },
    });

    revalidatePath('/category');
};
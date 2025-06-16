'use server';

import prisma from "@/lib/prisma";
import { getRoleByUserId } from "@/lib/users/getRole";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCategory(name: string, description: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.EDITOR) {
        throw new Error('Only Admin and Moderator are allowed to create categories');
    };

    const slug = name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    await prisma.category.create({
        data: {
            name,
            slug,
            description
        }
    });

    revalidatePath('/content/create');
};
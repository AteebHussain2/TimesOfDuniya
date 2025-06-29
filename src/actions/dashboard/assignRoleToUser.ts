'use server';

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function assignRoleToUser(targetUserId: string, role: string, username: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    if (userId === targetUserId) {
        throw new Error('You cannot assign role to yourself');
    };

    const userRole = await prisma.user.findUnique({ where: { id: userId } });
    if (userRole?.role !== 'ADMIN') {
        throw new Error('Only Admin is allowed to assign roles');
    };

    await prisma.user.update({
        where: { id: targetUserId, username },
        data: { role: role as Role },
    });
    revalidatePath('/admin/users');
}
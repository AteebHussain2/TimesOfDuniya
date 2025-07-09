'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetAllUsersData() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    return await prisma.user.findMany({
        orderBy: {
            updatedAt: 'desc',
        },
        // cacheStrategy: { swr: 3 * 60 * 60, ttl: 30 * 60 },
    });
};
'use server';

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetUserDataByUserId() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    return await prisma.user.findUnique({
        where: {
            id: userId
        },
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    });
}
'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetAllTags() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };
    return await prisma.tag.findMany({
        cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
    });
};
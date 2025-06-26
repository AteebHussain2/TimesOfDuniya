'use server';

import prisma from "@/lib/prisma";

export async function GetFirstPost() {
    return await prisma.post.findFirst({
        where: {
            published: true,
            publishedAt: {
                not: null
            },
        },
        include: {
            category: true,
            author: true,
            tags: true
        },
    })
}
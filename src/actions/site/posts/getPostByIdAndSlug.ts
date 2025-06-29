'use server';

import prisma from "@/lib/prisma";

export async function GetPostByIdAndSlug(id: number, slug: string) {
    return await prisma.post.findUnique({
        where: {
            id,
            slug,
        },
        include: {
            tags: true,
            category: true,
            author: true,
            views: true,
            likes: true,
            comments: true,
        },
    });
};
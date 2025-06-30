'use server';

import { getRoleByUserId } from "@/lib/users/getRole";
import { createPostSchema } from "@/lib/post/post";
import { UserRoles } from "@/lib/users/userRole";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function createPost(formData: z.infer<typeof createPostSchema>) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('You are not allowed to create posts');
    };

    const slug = formData.title
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    let publishedAt;
    if (formData.published) {
        publishedAt = new Date();
    }

    await prisma.post.create({
        data: {
            thumbnail: formData.thumbnail,
            title: formData.title,
            slug: slug,
            content: formData.content,
            summary: formData.summary,
            tags: formData.tags
                ? {
                    connectOrCreate: formData.tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                }
                : undefined,
            authorId: userId,
            categoryId: Number(formData.category),
            published: formData.published,
            publishedAt: publishedAt,
            createdAt: new Date(),
            updatedAt: new Date()
        },
    });

    return redirect('/content');
}
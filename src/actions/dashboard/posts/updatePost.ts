'use server';

import { getRoleByUserId } from "@/lib/users/getRole";
import { createPostSchema } from "@/lib/post/post";
import { UserRoles } from "@/lib/users/userRole";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { z } from "zod";

interface Props {
    id: number,
    slug: string,
    formData: z.infer<typeof createPostSchema>,
};

export async function UpdatePost({ id, slug, formData }: Props) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    };

    const role = await getRoleByUserId(userId);
    if (role === UserRoles.MEMBER) {
        throw new Error('You are not allowed to create posts');
    };

    const category = await prisma.category.findUnique({ where: { slug: formData.category } });
    if (!category) {
        throw new Error('Category not found');
    }

    const newSlug = formData.title
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    let publishedAt;
    if (formData.published) {
        publishedAt = new Date();
    }

    await prisma.post.update({
        where: {
            id,
            slug,
        },
        data: {
            thumbnail: formData.thumbnail,
            title: formData.title,
            slug: newSlug,
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
            categoryId: category.id,

            published: formData.published,
            publishedAt: publishedAt,
            updatedAt: new Date()
        },
    });

    revalidatePath('/content/edit/[id]/[slug]', 'page');
    return redirect('/content');
};
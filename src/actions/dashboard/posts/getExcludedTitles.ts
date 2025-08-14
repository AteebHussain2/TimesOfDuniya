'use server';

import prisma from "@/lib/prisma";

export async function GetExcludedTitles() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const categories = await prisma.category.findMany({
        select: {
            slug: true,
            posts: {
                select: { title: true },
                where: {
                    createdAt: { gte: sevenDaysAgo },
                },
            },
        },
    });

    const excludedTitlesByCategory: Record<string, string[]> = {};
    categories.forEach((category) => {
        const postTitles = category.posts.map(post => post.title);
        excludedTitlesByCategory[category.slug] = [...postTitles];
    });

    return excludedTitlesByCategory;
};

export async function GetExcludedTitlesByCategory(categoryId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const postTitles = await prisma.post.findMany({
        select: {
            title: true
        },
        where: {
            categoryId,
            createdAt: { gte: sevenDaysAgo },
        },
    });

    return postTitles.map(item => item.title);
};

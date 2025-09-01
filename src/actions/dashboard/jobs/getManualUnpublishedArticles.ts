"use server";

import prisma from "@/lib/prisma";
import { TRIGGER } from "@prisma/client";

export async function GetManualUnpublishedArticles() {
    return prisma.article.findMany({
        where: {
            publishedAt: null,
            publishedUrl: null,
            job: {
                trigger: TRIGGER.MANUAL,
            },
        },
        select: {
            id: true,
            title: true,
            createdAt: true,
            thumbnail: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });
};
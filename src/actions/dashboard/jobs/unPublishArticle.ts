"use server";

import { revalidatePath } from "next/cache";
import { STATUS } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function UnPublishArticle(jobId: number, topicId: number) {
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            topics: {
                where: { id: topicId },
                select: { id: true },
            },
            articles: {
                where: { topicId },
                select: { id: true, publishedUrl: true },
            },
        },
    });

    if (!job) {
        throw new Error("Job not found!");
    }

    if (!job.topics.length) {
        throw new Error("Topic not found for this job!");
    }

    if (!job.articles.length) {
        throw new Error("No article found for this topic!");
    }

    const article = job.articles[0];
    const postId = parseInt(article.publishedUrl?.split('/')[4] || '')

    if (!postId || isNaN(postId)) {
        throw new Error("PostId not found to unpblish article!");
    }

    await prisma.post.delete({
        where: {
            id: postId,
        },
    });

    await prisma.article.update({
        where: { id: article.id },
        data: {
            publishedAt: null,
            publishedUrl: null,
        },
    });

    await prisma.job.update({
        where: { id: jobId },
        data: { status: STATUS.PENDING }
    });

    revalidatePath('/job/[jobId]/topic/[topicId]/preview', 'page');
    revalidatePath('/ai/topics/[id]', 'page');
    revalidatePath('/ai/articles/[id]', 'page');
    return;
}
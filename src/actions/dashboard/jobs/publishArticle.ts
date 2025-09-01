"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ARTICLESTATUS, STATUS } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function PublishArticle(jobId: number, topicId: number) {
    const { userId } = await auth();
    const guestAuthorId = process.env.GUEST_AUTHOR_ID;
    if (!guestAuthorId) throw new Error('Guest Author Id not found!');

    const authorId = userId || guestAuthorId;

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            topics: {
                where: { id: topicId },
            },
            articles: {
                where: { topicId },
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

    if (!article.thumbnail) {
        throw new Error("Article has no thumbnail — cannot publish!");
    }

    const postSlug = article.title
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    const post = await prisma.post.create({
        data: {
            thumbnail: article.thumbnail,
            title: article.title,
            slug: postSlug,
            summary: article.summary,
            content: article.content,
            source: {
                create: article.source.map(source => ({ url: source }))
            },
            published: true,
            publishedAt: new Date(),
            categoryId: article.categoryId,
            tags: {
                connectOrCreate: article.tags.map((tag) => ({
                    where: { name: tag },
                    create: { name: tag },
                })),
            },
            authorId,

            accuracy: article.accuracy,
            articleStatus: article?.articleStatus === "APPROVED" ? ARTICLESTATUS.APPROVED : ARTICLESTATUS.REJECTED,
            feedback: article.feedback,
            reason: article.reasoning,
        },
    });

    await prisma.article.update({
        where: { id: article.id },
        data: {
            publishedAt: new Date(),
            publishedUrl: `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/post/${post.id}/${post.slug}`,
        },
    });

    const allTopics = await prisma.topic.findMany({
        where: { jobId },
        include: { articles: true }
    });

    const allArticlesPublished = allTopics.every(topic =>
        topic.articles.length > 0 &&
        topic.articles.every(article => article.publishedAt !== null)
    );

    if (allArticlesPublished && job.totalItems === job.completedItems) {
        await prisma.job.update({
            where: { id: jobId },
            data: { status: STATUS.COMPLETED }
        });
    };

    revalidatePath('/job/[jobId]/topic/[topicId]/preview', 'page');
    return post;
};
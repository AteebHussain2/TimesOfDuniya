"use server";

import { GenerateArticleRequest, ReGenerateArticleRequest } from "./executeJob";
import { auth } from "@clerk/nextjs/server";
import { STATUS } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GenerateArticle(jobId: number, topicId: number) {
    const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Missing validation credentials!");

    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized!");
    }

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
        throw new Error("Job not found");
    }

    if (job.topics.length === 0) {
        throw new Error("Topic not found in this job!");
    }

    if (job.topics.some(topic => topic.status === STATUS.PROCESSING || topic.status === STATUS.QUEUED)) {
        throw new Error("Article generation in process!");
    }

    if (job.articles.some(article => article.topicId === topicId)) {
        const existingArticle = job.articles.find(a => a.topicId === topicId);
        if (!existingArticle) throw new Error("Article not found for regeneration!");

        return await ReGenerateArticleRequest({
            jobId,
            jobTrigger: job.trigger,
            articleId: existingArticle.id,
            topics: job.topics,
            BACKEND_BASE_URL,
            SECRET_KEY,
        });
    }

    return await GenerateArticleRequest({
        jobId,
        jobTrigger: job.trigger,
        topics: job.topics,
        BACKEND_BASE_URL,
        SECRET_KEY,
    });
};


export async function GetJobByTopicIdAndJobId(jobId: number, topicId: number) {
    return await prisma.job.findUnique({
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
}
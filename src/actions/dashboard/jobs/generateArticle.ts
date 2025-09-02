"use server";

import { GenerateArticleRequest } from "./executeJob";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { STATUS } from "@prisma/client";

export async function GenerateArticle(jobId: number, topicId: number) {
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

    if (job.articles.some(article => article.status === STATUS.PROCESSING || article.status === STATUS.QUEUED)) {
        throw new Error("Cannot generate article!");
    }

    const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Missing validation credentials!");

    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

    const result = await GenerateArticleRequest({
        jobId,
        jobTrigger: job.trigger,
        topics: job.topics,
        BACKEND_BASE_URL,
        SECRET_KEY,
    });

    return result;
};
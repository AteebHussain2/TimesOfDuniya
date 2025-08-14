'use server';

import { STATUS, TRIGGER, TYPE } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GetCronPendingWork() {
    const [queuedJobs, pendingTopics, pendingArticles] = await Promise.all([
        prisma.job.count({
            where: {
                status: STATUS.QUEUED,
                trigger: TRIGGER.CRON,
            },
            cacheStrategy: { swr: 300, ttl: 60 }
        }),
        prisma.topic.count({
            where: {
                status: STATUS.COMPLETED,
                job: {
                    trigger: TRIGGER.CRON,
                    type: TYPE.TOPIC_GENERATION,
                },
                articles: {
                    none: {},
                },
            },
            cacheStrategy: { swr: 300, ttl: 60 }
        }),
        prisma.article.count({
            where: {
                status: STATUS.COMPLETED,
                publishedAt: null,
                job: {
                    trigger: TRIGGER.CRON,
                    type: TYPE.ARTICLE_GENERATION,
                },
            },
            cacheStrategy: { swr: 300, ttl: 60 }
        }),
    ]);

    return {
        queuedJobs,
        pendingTopics,
        pendingArticles,
    };
}

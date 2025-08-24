'use server';

import prisma from "@/lib/prisma";
import { TRIGGER, STATUS } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export async function GetCronUsageStats() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Get total + successful jobs with CRON trigger created today
    const cronJobs = await prisma.job.findMany({
        where: {
            trigger: TRIGGER.CRON,
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
            status: {
                not: STATUS.QUEUED,
            },
        },
        select: {
            status: true,
        },
        cacheStrategy: { swr: 300, ttl: 60 }
    });

    const totalJobs = cronJobs.length;
    const successCount = cronJobs.filter(job => job.status === STATUS.PENDING).length;

    const successRate = totalJobs === 0 ? 0 : (successCount / totalJobs) * 100;

    // Get usage metrics for today with CRON trigger
    const usage = await prisma.usageMetric.aggregate({
        where: {
            trigger: TRIGGER.CRON,
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        _sum: {
            totalTokens: true,
            successfulRequests: true,
        },
        cacheStrategy: { swr: 300, ttl: 60 }
    }) as { _sum: { totalTokens: number | null, successfulRequests: number | null } };

    return {
        date: todayStart,
        totalJobs,
        successRate: Number(successRate.toFixed(2)),
        requests: usage._sum?.successfulRequests || 0,
        tokensUsed: usage._sum?.totalTokens || 0,
    };
}

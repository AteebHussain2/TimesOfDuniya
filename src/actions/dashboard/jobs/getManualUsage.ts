'use server';

import { startOfMonth, endOfMonth } from "date-fns";
import { TRIGGER } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GetManualUsage() {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const jobs = await prisma.job.findMany({
        where: {
            trigger: TRIGGER.MANUAL,
            createdAt: {
                gte: monthStart,
                lte: monthEnd,
            },
        },
        select: {
            userId: true
        }
    })

    // Fetch all MANUAL usage metrics for the current month
    const usage = await prisma.usageMetric.findMany({
        where: {
            trigger: TRIGGER.MANUAL,
            date: {
                gte: monthStart,
                lte: monthEnd,
            },
        },
        select: {
            successfulRequests: true,
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    // Unique user IDs (non-null for guests or signed-in users)
    const uniqueUserIds = new Set(jobs.map(j => j.userId).filter(Boolean));

    // Aggregate usage metrics
    const totalSuccessfulRequests = usage.reduce((sum, entry) => sum + (entry.successfulRequests || 0), 0);

    // Count articles whose related job has trigger = MANUAL and created this month
    const articlesCreated = await prisma.article.count({
        where: {
            createdAt: {
                gte: monthStart,
                lte: monthEnd,
            },
            job: {
                trigger: TRIGGER.MANUAL,
            },
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    const topicsCreated = await prisma.topic.count({
        where: {
            createdAt: {
                gte: monthStart,
                lte: monthEnd,
            },
            job: {
                trigger: TRIGGER.MANUAL,
            },
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    return {
        uniqueUsers: uniqueUserIds.size,
        totalRequests: totalSuccessfulRequests,
        topicsCreated,
        articlesCreated,
    };
}

'use server';

import { startOfMonth } from 'date-fns';
import prisma from '@/lib/prisma';
import { STATUS } from '@prisma/client';

export async function GetCombinedUsage() {
    const monthStart = startOfMonth(new Date());

    // Fetch jobs this month
    const jobs = await prisma.job.findMany({
        where: {
            createdAt: {
                gte: monthStart,
            },
        },
        select: {
            id: true,
            status: true,
        },
        cacheStrategy: { swr: 300, ttl: 60 }
    });

    const totalJobs = jobs.length;
    const successCount = jobs.filter(j => j.status === STATUS.COMPLETED || j.status === STATUS.PENDING).length;
    const failedCount = jobs.filter(j => j.status === STATUS.FAILED).length;

    const successRate = totalJobs === 0 ? 0 : (successCount / totalJobs) * 100;

    // Determine health
    let systemHealth: 'Healthy' | 'Warning' | 'Critical' = 'Critical';
    if (successRate >= 90) systemHealth = 'Healthy';
    else if (successRate >= 75) systemHealth = 'Warning';

    // Get all related usage metrics
    const jobIds = jobs.map(j => j.id);

    const usageMetrics = await prisma.usageMetric.findMany({
        where: {
            jobId: {
                in: jobIds,
            },
        },
        select: {
            totalTokens: true,
            successfulRequests: true,
        },
        cacheStrategy: { swr: 300, ttl: 60 }
    });

    const tokensUsed = usageMetrics.reduce((sum, u) => sum + u.totalTokens, 0);
    const requestsMade = usageMetrics.reduce((sum, u) => sum + u.successfulRequests, 0);

    return {
        totalJobs,
        successCount,
        failedCount,
        successRate: successRate.toFixed(2),
        tokensUsed,
        requestsMade,
        systemHealth,
    };
}

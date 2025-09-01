import { STATUS, TRIGGER, TYPE } from "@prisma/client";
import prisma from "@/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export async function GetQueuedJobsWithRequestsCount() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const queuedJobs = await prisma.job.count({
        where: {
            type: TYPE.TOPIC_GENERATION,
            status: STATUS.QUEUED,
            trigger: TRIGGER.CRON,
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    const usage = await prisma.usageMetric.aggregate({
        where: {
            trigger: TRIGGER.CRON,
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        _sum: {
            successfulRequests: true,
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    }) as { _sum: { successfulRequests: number | null } };

    return {
        requests: usage?._sum.successfulRequests || 0,
        queuedJobs: queuedJobs || 0,
    };
};
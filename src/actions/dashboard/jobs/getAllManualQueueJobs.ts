"use server";

import { Prisma, STATUS, TRIGGER } from "@prisma/client";
import prisma from "@/lib/prisma";

export type Job = Prisma.JobGetPayload<{
    include: {
        topics: {
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
                source: true,
                summary: true,
            },
        },
    },
}>;

export async function GetAllManualQueueJobs(): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
        where: {
            status: {
                in: [STATUS.QUEUED, STATUS.PROCESSING]
            },
            trigger: TRIGGER.MANUAL,
        },
        select: {
            id: true,
            type: true,
            status: true,
        },
        orderBy: { updatedAt: 'desc' },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    return jobs as Job[];
}

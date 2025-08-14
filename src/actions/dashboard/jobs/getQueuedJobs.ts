"use server";

import prisma from "@/lib/prisma";
import { TypeJobWithTopics } from "@/lib/types";
import { STATUS, TRIGGER } from "@prisma/client";

export async function GetQueuedJob(trigger: TRIGGER): Promise<TypeJobWithTopics[]> {
    const jobs = await prisma.job.findMany({
        where: {
            status: STATUS.QUEUED,
            trigger,
        },
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
        orderBy: { updatedAt: 'desc' },
        cacheStrategy: { swr: 300, ttl: 60 }
    });

    return jobs as TypeJobWithTopics[];
}

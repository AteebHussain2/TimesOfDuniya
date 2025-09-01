"use server";

import { STATUS, TRIGGER } from "@prisma/client";
import { TypeJob } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GetQueuedJob(trigger: TRIGGER): Promise<TypeJob[]> {
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
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    return jobs as TypeJob[];
}

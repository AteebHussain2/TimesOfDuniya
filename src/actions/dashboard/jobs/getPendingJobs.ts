"use server";

import { STATUS, TRIGGER } from "@prisma/client";
import { TypeJob } from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GetPendingJobs(trigger: TRIGGER): Promise<TypeJob[]> {
    const jobs = await prisma.job.findMany({
        where: {
            status: STATUS.PENDING,
            trigger,
        },
        include: {
            topics: { select: { id: true, title: true, status: true, createdAt: true, source: true, summary: true }, orderBy: { id: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
        cacheStrategy: { swr: 10, ttl: 10 },
    });

    return jobs as TypeJob[];
}
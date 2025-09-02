"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Job = Prisma.JobGetPayload<{
    include: {
        topics: {
            orderBy: {
                id: 'asc',
            },
        },
        articles: true,
    },
}>;

export async function GetJobWithTopicsAndArticlesById(jobId: number): Promise<Job> {
    const userId = await auth();
    if (!userId) {
        throw new Error("Unauthorized!");
    };

    return await prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            topics: {
                orderBy: {
                    id: 'asc',
                },
            },
            articles: true,
        },
    }) as Job;
}

export async function GetJobWtihTopicsById(jobId: number) {
    const userId = await auth();
    if (!userId) {
        throw new Error("Unauthorized!");
    };

    return await prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            topics: true
        },
    });
}
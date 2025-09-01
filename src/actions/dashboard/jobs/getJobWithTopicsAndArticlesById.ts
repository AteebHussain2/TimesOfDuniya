"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GetJobWithTopicsAndArticlesById(jobId: number) {
    const userId = await auth();
    if (!userId) {
        throw new Error("Unauthorized!");
    };

    return await prisma.job.findUnique({
        where: {
            id: jobId,
        },
        include: {
            topics: true,
            articles: true,
        },
    });
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
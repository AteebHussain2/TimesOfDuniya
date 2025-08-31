"use server"

import { getOrCreateGuestId } from "@/lib/guestUser"
import { Prisma, TRIGGER } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export type Job = Prisma.JobGetPayload<{
    include: {
        topics: {
            include: {
                articles: true
            }
        },
        category: true,
    },
}>;

export type TopicWithArticles = Prisma.TopicGetPayload<{
    include: {
        articles: true
    },
}>;

export async function GetLatestManualTopics(): Promise<Job> {
    const { userId: clerkId } = await auth();
    const guestId = await getOrCreateGuestId();
    const userId = clerkId || guestId;

    if (!userId) {
        throw new Error("User not identified")
    }

    return await prisma.job.findFirst({
        where: {
            userId,
            trigger: TRIGGER.MANUAL,
        },
        orderBy: { createdAt: "desc" },
        include: {
            topics: {
                include: {
                    articles: true
                }
            },
            category: true,
        },
    }) as Job
}

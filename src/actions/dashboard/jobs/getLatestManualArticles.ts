"use server"

import { getOrCreateGuestId } from "@/lib/guestUser"
import { Prisma, TRIGGER, TYPE } from "@prisma/client";
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export type Job = Prisma.JobGetPayload<{
    include: {
        articles: true,
        category: true,
    },
}>;

export async function GetLatestManualArticles(): Promise<Job> {
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
            topics: {
                some: {
                    id: {
                        not: undefined
                    }
                }
            },
        },
        orderBy: { createdAt: "desc" },
        include: {
            articles: true,
            category: true,
        },
    }) as Job
}

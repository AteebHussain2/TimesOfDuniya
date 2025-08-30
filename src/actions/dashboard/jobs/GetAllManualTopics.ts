"use server"

import { getOrCreateGuestId } from "@/lib/guestUser"
import { Prisma, TRIGGER } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export type TopicWithJob = Prisma.TopicGetPayload<{
    include: {
        job: {
            include: {
                category: true
            }
        },
        articles: true
    }
}>

export async function GetAllManualTopics(): Promise<TopicWithJob[]> {
    const { userId: clerkId } = await auth()
    const guestId = await getOrCreateGuestId()
    const userId = clerkId || guestId

    if (!userId) {
        throw new Error("User not identified")
    }

    const topics = await prisma.topic.findMany({
        where: {
            job: {
                userId,
                trigger: TRIGGER.MANUAL,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            job: {
                include: {
                    category: true,
                },
            },
            articles: true
        },
    })

    return topics as TopicWithJob[]
}

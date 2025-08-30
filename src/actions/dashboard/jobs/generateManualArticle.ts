"use server"

import { getOrCreateGuestId } from "@/lib/guestUser"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { TRIGGER } from "@prisma/client"

export async function GenerateManualArticle({
    topicId,
    jobId,
    prompt,
}: {
    topicId: number
    jobId?: number
    prompt?: string
}) {
    try {
        let userId: string
        const { userId: id } = await auth();
        if (!id) {
            userId = await getOrCreateGuestId()
        } else {
            userId = id
        }

        if (!jobId) {
            throw new Error("Job Id not found!");
        }

        const topic = await prisma.topic.findUnique({ where: { id: topicId } })

        const SECRET_KEY = process.env.BACKEND_SECRET_KEY
        if (!SECRET_KEY) throw new Error("Missing validation credentials!")

        const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL
        if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL")


        const response = await fetch(`${BACKEND_BASE_URL}/api/posts/create-manual-article`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SECRET_KEY}`,
            },
            body: JSON.stringify({
                title: topic?.title,
                summary: topic?.summary,
                published: topic?.published,
                sources: topic?.source,
                categoryId: topic?.categoryId,
                jobId,
                topicId,
                userId,
                trigger: TRIGGER.MANUAL,
                prompt,
            }),
        })

        if (!response.ok) {
            throw new Error("Unexpected Error: Server returned failed status!")
        }

        const data = await response.json()
        return { ok: true, message: "Article job queued successfully!", data }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        throw new Error(errorMessage)
    }
}

"use server"

import { getOrCreateGuestId } from "@/lib/guestUser"
import { auth } from "@clerk/nextjs/server"
import { TRIGGER } from "@prisma/client"

export async function CreateSingleTopic({
    minTopics,
    maxTopics,
    timeDuration,
    prompt,
    categoryId,
}: {
    minTopics: number
    maxTopics: number
    timeDuration: string
    prompt?: string
    categoryId: number
}) {
    try {
        let userId: string
        const { userId: id } = await auth();
        if (!id) {
            userId = await getOrCreateGuestId();
        } else {
            userId = id;
        };

        const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
        if (!SECRET_KEY) throw new Error("Missing validation credentials!");

        const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
        if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

        const response = await fetch(`${BACKEND_BASE_URL}/api/posts/create-topic`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SECRET_KEY}`,
            },
            body: JSON.stringify({
                min_topics: minTopics,
                max_topics: maxTopics,
                time_duration: timeDuration,
                prompt,
                categoryId,
                trigger: TRIGGER.MANUAL,
                userId,
            }),
        })

        if (!response.ok) {
            throw new Error("Unexpected Error: Server returned failed status!")
        }

        const data = await response.json()
        return { ok: true, message: "Topic job queued successfully!", data }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        throw new Error(errorMessage)
    }
}

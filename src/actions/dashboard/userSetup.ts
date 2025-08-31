"use server"

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getOrCreateGuestId } from "@/lib/guestUser";

export async function UserSetup() {
    const guestId = await getOrCreateGuestId();
    const { userId } = await auth()

    if (!userId) {
        throw new Error("User not authenticated")
    }

    try {
        await prisma.job.updateMany({
            where: {
                userId: guestId,
            },
            data: {
                userId,
            },
        })

        return { success: true }
    } catch (err) {
        console.error("User setup failed:", err)
        return { success: false, error: "Failed to migrate jobs" }
    }
}

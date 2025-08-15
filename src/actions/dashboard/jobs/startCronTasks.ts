"use server";

import { UserRoles } from "@/lib/users/userRole";
import { GetQueuedJobsWithRequestsCount } from "./getQueuedJobsWithRequestsCount";

export async function StartCronTasks(role: string) {
    const data = await GetQueuedJobsWithRequestsCount();

    if (data?.requests >= 150) {
        throw new Error("You have exceeded per day limit!");
    } else if (data?.queuedJobs > 0) {
        throw new Error("Jobs have already been queued!");
    }

    const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;
    const SECRET_KEY = process.env.CRON_API_SECRET_KEY;

    if (role === UserRoles.EDITOR) {
        throw new Error(`You don't have access to this command! Visit ${FRONTEND_BASE_URL}/ai`);
    };

    try {
        const response = await fetch(`${FRONTEND_BASE_URL}/api/posts/cron`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`
            },
        });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(`${data.message}`)
        }

        return { success: true, message: data.message };
    } catch (error: any) {
        throw new Error(`Failed to queue tasks: ${error.message}`)
    }
};
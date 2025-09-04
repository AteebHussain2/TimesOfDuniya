import { endOfDay, startOfDay } from "date-fns";
import prisma from "@/lib/prisma";

export async function GetCronRequests() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Get usage metrics for today with CRON trigger
    const usage = await prisma.usageMetric.aggregate({
        _sum: {
            successfulRequests: true,
        },
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    }) as { _sum: { successfulRequests: number | null } };

    return usage._sum?.successfulRequests || 0
}
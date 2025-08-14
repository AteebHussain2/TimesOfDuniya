'use server';

import { endOfToday, subDays, eachDayOfInterval, format } from "date-fns";
import { STATUS } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function GetJobsChartData() {
    const today = endOfToday();
    const startDate = subDays(today, 19); // Include today = total 20 days
    const dateFormat = "yyyy-MM-dd";

    // Step 1: Get raw job counts from DB within range
    const jobs = await prisma.job.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: today,
            },
        },
        select: {
            createdAt: true,
            status: true,
        },
        cacheStrategy: { swr: 300, ttl: 60 }
    });

    // Step 2: Prepare blank stats for each day
    const stats: Record<string, { success: number; failed: number }> = eachDayOfInterval({ start: startDate, end: today })
        .map(date => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = { success: 0, failed: 0 };
            return acc;
        }, {} as Record<string, { success: number; failed: number }>);

    // Step 3: Fill actual job data
    for (const job of jobs) {
        const date = format(job.createdAt, dateFormat);
        if (stats[date]) {
            if (job.status === STATUS.COMPLETED || job.status === STATUS.PENDING) {
                stats[date].success += 1;
            } else if (job.status === STATUS.FAILED) {
                stats[date].failed += 1;
            }
        }
    }

    // Step 4: Convert to array format
    const chartData = Object.entries(stats).map(([date, info]) => ({
        date,
        success: info.success,
        failed: info.failed,
    }));

    return chartData;
}

import { TYPE, STATUS, TRIGGER } from "@prisma/client";
import { isValidSecret } from "@/lib/isValidSecret";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("@@AUTH HEADER: ", request.headers.get("authorization"));
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    const API_KEY = process.env.BACKEND_SECRET_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY not found to validate the request!")
    };

    if (!isValidSecret(secret, API_KEY)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { status, error, topics, categoryId, trigger, usage, jobId } = body;
        if (!categoryId || !Array.isArray(topics)) {
            return NextResponse.json({ error: "Missing or invalid payload" }, { status: 401 });
        }

        const jobStatus = status === "COMPLETED" && topics.length !== 0 ? STATUS.PENDING : STATUS.FAILED;

        // Creating a COMPLETED Job
        const job = await prisma.job.update({
            where: {
                id: jobId,
            },
            data: {
                type: TYPE.TOPIC_GENERATION,
                status: jobStatus,
                totalItems: topics.length,
                error: error ?? '',
            },
        });

        // Create Topics (only if job succeeded)
        if (jobStatus === STATUS.PENDING) {
            const topicRecords = topics.map((topic: any) => ({
                jobId: job.id,
                categoryId: Number(categoryId),
                title: topic.title,
                summary: topic.summary || null,
                source: topic.source || null,
                published: topic.published,
                status: STATUS.COMPLETED,
            }));

            await prisma.topic.createMany({ data: topicRecords });
        }

        // Save UsageMetric if present
        if (usage && usage.total_tokens) {
            await prisma.usageMetric.create({
                data: {
                    trigger: trigger ?? TRIGGER.CRON,
                    date: usage.date,
                    promptTokens: usage.prompt_tokens,
                    completionTokens: usage.completion_tokens,
                    totalTokens: usage.total_tokens,
                    successfulRequests: usage.successful_requests,
                    jobId: job.id,
                }
            });
        };

        revalidatePath(`/${trigger.toLowerCase()}/jobs/queued`);

        return NextResponse.json({ message: "Topics and job created successfully", jobId: job.id });

    } catch (error) {
        revalidatePath(`/cron/jobs/queued`);
        revalidatePath(`/manual/jobs/queued`);

        console.error("[WEBHOOK_TOPICS_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

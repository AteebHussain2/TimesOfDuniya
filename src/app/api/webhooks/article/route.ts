import { TYPE, STATUS, TRIGGER, ARTICLESTATUS } from "@prisma/client";
import { isValidSecret } from "@/lib/isValidSecret";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
        const { categoryId, jobId, data, status, trigger, topicId, error, usage } = body;
        if (!jobId || !status || !categoryId || !data || !trigger) {
            return NextResponse.json({ error: "Missing or invalid payload" }, { status: 401 });
        }

        const article = data?.article ?? [];
        const jobStatus = (status === "COMPLETED" && article.length !== 0) ? STATUS.PENDING : STATUS.FAILED;

        await prisma.job.update({
            where: { id: jobId },
            data: {
                error: error ?? '',
                type: TYPE.ARTICLE_GENERATION,
                status: jobStatus,
            }
        });

        // Save article to DB
        if (jobStatus === STATUS.PENDING && article) {
            const articleStatus = data.status === "APPROVED" && article.length !== 0 ? ARTICLESTATUS.APPROVED : ARTICLESTATUS.REJECTED;

            await prisma.article.create({
                data: {
                    topicId: topicId,
                    jobId,
                    categoryId,
                    status: STATUS.COMPLETED,

                    title: article.title,
                    summary: article.summary,
                    content: article.content,
                    tags: article.tags,
                    source: article.source,

                    articleStatus,
                    accuracy: data.accuracy_score,
                    reasoning: data.reason,
                    feedback: data.feedback,
                }
            });

            await prisma.job.update({
                where: { id: jobId },
                data: {
                    completedItems: { increment: 1 }
                }
            });
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
                    jobId,
                }
            });
        };

        revalidatePath(`/${trigger.toLowerCase()}/jobs/queued`);

        return NextResponse.json("Successful! Job Updated!")
    } catch (error) {
        console.error("[WEBHOOK_ARTICLE_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

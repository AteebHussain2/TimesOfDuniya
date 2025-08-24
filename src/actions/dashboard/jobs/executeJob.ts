"use server";

import { GetExcludedTitlesByCategory } from "../posts/getExcludedTitles";
import { Category, Role, STATUS, Topic, TYPE } from "@prisma/client";
import { getRole } from "@/lib/users/getRole";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function ExecuteJob(jobId: number) {
    const role = await getRole();
    if (role === Role.EDITOR || role === Role.MEMBER) {
        throw new Error("You don't have access to this!");
    };

    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            topics: true,
            articles: true,
        },
    });

    if (!job) {
        throw new Error("Job not found");
    }

    const topicsNeedingArticles = job.topics.filter(
        topic => !job.articles.some(article => article.topicId === topic.id)
    );

    const jobStatus = job?.status;

    const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Missing validation credentials!");

    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

    switch (jobStatus) {
        case STATUS.FAILED:
            switch (job.type) {
                case TYPE.TOPIC_GENERATION:
                    const category = await prisma.category.findUnique({ where: { id: job.categoryId } });
                    if (!category) throw new Error("Category not found for job");

                    const excluded_titles = await GetExcludedTitlesByCategory(category?.id);
                    await GenerateTopicRequest({
                        jobId,
                        category,
                        min_topics: 1,
                        max_topics: 2,
                        time_duration: "24 hours",
                        excluded_titles,
                        BACKEND_BASE_URL,
                        SECRET_KEY,
                        path: "/create-topic/retry"
                    });

                    revalidatePath(`/cron/jobs/failed`);
                    revalidatePath(`/manual/jobs/failed`);
                    break;

                case TYPE.ARTICLE_GENERATION:
                    const topics = topicsNeedingArticles;
                    if (!topics?.length) {
                        throw new Error("No topics available for article generation!");
                    }

                    GenerateArticleRequest({
                        topics,
                        jobId,
                        jobTrigger: job?.trigger,
                        BACKEND_BASE_URL,
                        SECRET_KEY,
                    });

                    revalidatePath(`/cron/jobs/failed`);
                    revalidatePath(`/manual/jobs/failed`);
                    redirect(`/job/${jobId}/topic/${job.topics[0].id}/preview`);
            };
            break;

        case STATUS.PENDING:
            switch (job.type) {
                case TYPE.TOPIC_GENERATION:
                    const topics = topicsNeedingArticles;
                    if (!topics || !Array.isArray(topics)) {
                        throw new Error("Topics are not generated yet!")
                    }

                    await GenerateArticleRequest({
                        topics,
                        jobId,
                        jobTrigger: job?.trigger,
                        BACKEND_BASE_URL,
                        SECRET_KEY,
                    })

                    revalidatePath(`/cron/jobs/pending`);
                    revalidatePath(`/manual/jobs/pending`);
                    redirect(`/job/${jobId}/topic/${job.topics[0].id}/preview`);


                case TYPE.ARTICLE_GENERATION:
                    redirect(`/job/${jobId}/topic/${job.topics[0].id}`)
            };
            break;
    }
};

export async function GenerateArticleRequest({
    topics,
    jobId,
    jobTrigger,
    BACKEND_BASE_URL,
    SECRET_KEY,
}: {
    topics: Topic[];
    jobId: number;
    jobTrigger: string;
    BACKEND_BASE_URL: string;
    SECRET_KEY: string;
}) {
    const results: { topic: string; ok: boolean }[] = [];
    for (const topic of topics) {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/posts/create-article`, {
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
                    trigger: jobTrigger,
                    topicId: topic.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error for topic: ${topic?.title}`);
            }

            results.push({ topic: topic?.title, ok: true });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            await prisma.job.update({
                where: { id: jobId },
                data: {
                    status: STATUS.FAILED,
                    error: errorMessage,
                    type: TYPE.ARTICLE_GENERATION,
                },
            });

            throw new Error(errorMessage);
        };
    };

    return { ok: true, results };
}


export async function GenerateTopicRequest({
    min_topics,
    max_topics,
    time_duration,
    excluded_titles,
    category,
    jobId,
    BACKEND_BASE_URL,
    SECRET_KEY,
    path,
}: {
    min_topics: number,
    max_topics: number,
    time_duration: string,
    excluded_titles?: string[];
    category: Category;
    jobId: number;
    BACKEND_BASE_URL: string,
    SECRET_KEY: string,
    path: string,
}) {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/api/posts${path}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SECRET_KEY}`,
                },
                method: "POST",
                body: JSON.stringify({
                    min_topics,
                    max_topics,
                    time_duration,
                    excluded_titles,
                    categoryName: category.name,
                    categoryId: category.id,
                    jobId,
                }),
            },
        );

        if (!response.ok) {
            throw new Error(`Unexpected Error: Server returned failed status!`);
        }

        return {
            ok: true,
            message: `Job queued for category ${category?.name}.`,
        };

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : String(error)
        await prisma.job.update({
            where: { id: jobId },
            data: { status: STATUS.FAILED, error: errorMessage, }
        });

        throw new Error(errorMessage);
    };
}
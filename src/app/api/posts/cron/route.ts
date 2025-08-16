import { GetExcludedTitles } from "@/actions/dashboard/posts/getExcludedTitles";
import { Category, STATUS, TRIGGER, TYPE } from "@prisma/client";
import { isValidSecret } from "@/lib/isValidSecret";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    const API_KEY = process.env.CRON_API_SECRET_KEY;
    if (!API_KEY) {
        throw new Error("API_KEY not found to validate the request!")
    };

    if (!isValidSecret(secret, API_KEY)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }


    try {
        const categories = await prisma.category.findMany({ where: { slug: { not: "blog" } } });
        const excluded_titles = await GetExcludedTitles()

        for (const category of categories) {
            const job = await prisma.job.create({
                data: {
                    categoryId: category.id,
                    type: TYPE.TOPIC_GENERATION,
                    status: STATUS.QUEUED,
                    trigger: TRIGGER.CRON
                },
            });

            await ExecuteTrendingTopicsAgent(category, excluded_titles[category.slug], job.id);
        }

        return NextResponse.json({
            ok: true,
            message: `Jobs queued for ${categories.length} categories.`,
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            ok: false,
            error: "Internal Server Error",
            message: (error instanceof Error) ? error.message : String(error),
            status: 500
        })
    }

}

async function ExecuteTrendingTopicsAgent(category: Category, excluded_titles: string[], jobId: number) {
    const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
    if (!SECRET_KEY) throw new Error("Missing validation credentials!");

    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
    if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/api/posts/create-topics/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SECRET_KEY}`,
                },
                method: "POST",
                body: JSON.stringify({
                    min_topics: 1,
                    max_topics: 2,
                    time_duration: "24 hours",
                    excluded_titles: excluded_titles,
                    category,
                    trigger: TRIGGER.CRON,
                    jobId,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Unexpected Error: Server returned failed status!`,)
        }

        return NextResponse.json({
            ok: true,
            message: `Job queued for category ${category.name}.`,
        });

    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : String(error)
        await prisma.job.update({
            where: { id: jobId },
            data: { status: STATUS.FAILED, error: errorMessage, }
        })

        throw new Error(`${errorMessage}`,)
    }
}
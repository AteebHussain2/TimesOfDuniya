import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { trigger, status, type } = body;

        if (!trigger || !status || !type) {
            return NextResponse.json(
                { ok: false, message: "Missing required params" },
                { status: 400 }
            );
        }

        // Always revalidate dashboard + job pages
        revalidatePath("/dashboard");
        revalidatePath('/job/[jobId]/topic/[topicId]', 'page');

        // CRON routes
        if (trigger === "CRON") {
            if (status === "PENDING") revalidatePath("/cron/job");
            if (status === "COMPLETED") revalidatePath("/cron/job/successful");
            if (status === "QUEUED") revalidatePath("/cron/job/queued");
            if (status === "FAILED") revalidatePath("/cron/job/failed");
        }

        // MANUAL routes
        if (trigger === "MANUAL") {
            if (status === "PENDING") revalidatePath("/manual/job");
            if (status === "COMPLETED") revalidatePath("/manual/job/successful");
            if (status === "QUEUED") revalidatePath("/manual/job/queued");
            if (status === "FAILED") revalidatePath("/manual/job/failed");

            // Always revalidate ai-related views
            revalidatePath("/ai");
            revalidatePath("/ai/dashboard");
            revalidatePath("/ai/topics");
            revalidatePath("/ai/articles");
        }

        return NextResponse.json({
            ok: true,
            message: "Revalidated successfully",
            body,
        });
    } catch (e: any) {
        console.error("Revalidate failed:", e);
        return NextResponse.json(
            { ok: false, message: "Revalidate failed", error: e.message },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isValidSecret } from "@/lib/isValidSecret";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
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
            revalidatePath("/ai/topics");
            revalidatePath("/ai/topics/[id]", "page");
            revalidatePath("/ai/articles");
            revalidatePath("/ai/articles/[id]", "page");
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

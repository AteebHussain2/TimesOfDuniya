import { isValidSecret } from "@/lib/isValidSecret";
import { NextResponse } from "next/server";

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
        const { jobId, title, summary, published, sources, categoryId } = body;

        const SECRET_KEY = process.env.BACKEND_SECRET_KEY;
        if (!SECRET_KEY) throw new Error("Missing validation credentials!");

        const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
        if (!BACKEND_BASE_URL) throw new Error("Missing Backend Base URL");

        try {
            const response = await fetch(
                `${BACKEND_BASE_URL}/api/posts/create-article/`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${SECRET_KEY}`,
                    },
                    method: "POST",
                    body: JSON.stringify({
                        jobId,
                        title,
                        summary,
                        published,
                        sources,
                        categoryId
                    }),
                }
            );

            const data = await response.json();
            console.log("Response for article:", JSON.stringify(data, null, 4));
            return NextResponse.json("Successful! Added topic to queue");
        } catch (error) {
            console.error("Failed to send request:", error);
            return NextResponse.json("Failed request: " + error)
        }

    } catch (error) {
        console.error("[ARTICLE_GENERATION_ERROR]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

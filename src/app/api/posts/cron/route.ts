import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";

type Topic = {
    title: string,
    summary: string,
    source: string[] | string,
    published: string
}

function isValidSecret(secret: string) {
    const API_SECRET = process.env.CRON_API_SECRET_KEY;
    if (!API_SECRET) {
        return false;
    };

    try {
        return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    } catch (error) {
        console.error(error);
        return false;
    };
};

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('@@AUTH HEADER: ', request.headers.get('authorization'))
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    };

    const secret = authHeader.split(' ')[1];
    if (!isValidSecret(secret)) {
        console.error('@@SECRET: ', secret)
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    };
    // const categories = await prisma.category.findMany();
    const categories = [{
        id: 1,
        name: "Pakistan",
        description: "",
        slug: "pakistan",
        createdAt: new Date,
        updatedAt: null
    }]

    for (const category of categories) {
        try {
            console.log("Invocation for: ", category.name);
            await ExecuteAgentProcess(category);
        } catch (error) {
            console.log('Error during invocation of CreatPost: ', error)
        };
    }

    return NextResponse.json(`Posts To Create: ${categories.length}`, { status: 200 });
}

async function ExecuteAgentProcess(category: Category) {
    const SECRET_KEY = process.env.BACKEND_SECRET_KEY
    if (!SECRET_KEY) {
        throw new Error("Missing validation credentials!");
    };

    const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL
    if (!BACKEND_BASE_URL) {
        throw new Error("Missing Backend Base Url");
    }

    try {
        // const response = await fetch(`${BACKEND_BASE_URL}/api/posts/create-topics/${category.name}`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${SECRET_KEY}`,
        //     },
        //     method: 'POST',
        //     body: JSON.stringify({
        //         "min_topics": 1,
        //         "max_topics": 2,
        //         "time_duration": "24 hours",
        //         "excluded_titles": [
        //             "Gunmen in Balochistan Pakistan Abduct and Kill Nine Bus Passengers",
        //             "Pakistan's Prime Minister Announces New Economic Reforms",
        //             "Pakistan's Cricket Team Wins Historic Match"
        //         ]
        //     }),
        // });

        // const data = await response.json();
        // console.log(JSON.stringify(data, null, 4))

        const data = {
            "message": "Successfull!",
            "content": {
                "root": [
                    {
                        "title": "Pakistan signs $4.5 billion loans with local banks to ease power sector debt",
                        "summary": "Pakistan has signed term sheets with 18 commercial banks for a 1.275 trillion Pakistani rupee ($4.50 billion) Islamic finance facility to help pay down its power sector debt.",
                        "source": "https://www.reuters.com/sustainability/boards-policy-regulation/pakistan-signs-45-billion-loans-with-local-banks-ease-power-sector-debt-2025-06-20/",
                        "published": "2025-06-20"
                    },
                    // {
                    //     "title": "Pakistan's economy steered towards transparency with SIFC's zero tolerance policy",
                    //     "summary": "A special report highlights the practical implementation and significant impact of Pakistan's \"Zero Tolerance...\" policy, aiming to enhance economic transparency.",
                    //     "source": "https://ptv.com.pk/ptvworld/newsdetail/8920",
                    //     "published": "2025-06-21"
                    // },
                ]
            }
        }

        const topics = data.content.root
        for (const topic of topics) {
            await ExecuteArticleWriterAgent(topic, BACKEND_BASE_URL, SECRET_KEY)
        }
    } catch (error) {
        console.error('Failed to send request: ', { status: 500, statusText: 'Something went wrong with server, see logs.', DetailedError: error, JSONDetailedError: JSON.stringify(error) });
    }
}

async function ExecuteArticleWriterAgent(topic: Topic, BACKEND_BASE_URL: string, SECRET_KEY: string) {
    try {
        console.log("Invocation for: ", topic.title);
        const response = await fetch(`${BACKEND_BASE_URL}/api/posts/create-article`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SECRET_KEY}`
            },
            method: 'POST',
            body: JSON.stringify(topic)
        });

        const article = await response.json();
        console.log(JSON.stringify(article, null, 4))
    } catch (error) {
        console.error('Failed to send request: ', { status: 500, statusText: 'Something went wrong with server, see logs.', DetailedError: error, JSONDetailedError: JSON.stringify(error) });
    }
}

async function PublishArticleToDataBase() {

}
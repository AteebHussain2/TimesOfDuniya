import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import prisma from "@/lib/prisma";

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

export async function POST(request: Request) {
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
    const categories = await prisma.category.findMany();


    categories.forEach((category) => {
        CreatePost(category.name, category.slug, category?.description);
    });

    return NextResponse.json(`Posts To Create: ${categories.length}`);
}

async function CreatePost(name: string, slug: string, description?: string | null) {
    try {
        const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/posts/create`, {
            headers: {
                'Content-Type': 'application/json',
                'SECRET_KEY': process.env.CRON_SECRET_KEY as string
            },
            method: 'POST',
            body: JSON.stringify({
                name,
                slug,
                description
            }),
        });

        const data = await response.json();
        new NextResponse('Request sent successfully: ', { status: data.status, statusText: data.statusText });
    } catch (error) {
        new NextResponse('Failed to send request: ', { status: 500, statusText: 'Something went wrong with server, see logs.' });
        console.error('Error in sending POST request to /api/posts/create' + error);
    }
}
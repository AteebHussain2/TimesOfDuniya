"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateJobArticle(id: number, filePath: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized!');
    };

    await prisma.article.update({
        where: {
            id,
        },
        data: {
            thumbnail: filePath,
        },
    });

    revalidatePath('/job/[jobId]/topic/[topicId]/preview', "page");
};
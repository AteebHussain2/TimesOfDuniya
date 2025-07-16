'use server'

import prisma from "@/lib/prisma"

export async function GetAllAuthors() {
    return await prisma.user.findMany({
        where: {
            role: {
                not: "MEMBER"
            },
        },
    });
};
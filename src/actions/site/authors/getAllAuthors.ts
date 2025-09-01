'use server'

import prisma from "@/lib/prisma"
import { Role } from "@prisma/client";

export async function GetAllAuthors() {
    return await prisma.user.findMany({
        where: {
            role: {
                not: Role.MEMBER
            },
        },
        cacheStrategy: { swr: 10, ttl: 10 },
    });
};
import { auth } from "@clerk/nextjs/server";
import prisma from "../prisma";

export async function getRole() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const userData = await prisma.user.findUnique({ where: { id: userId } });
    return userData?.role;
};

export async function getRoleByUserId(userId: string) {
    const userData = await prisma.user.findUnique({ where: { id: userId } });
    return userData?.role;
};
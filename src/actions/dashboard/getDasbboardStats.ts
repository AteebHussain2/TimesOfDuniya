'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Role } from "@prisma/client"

export async function GetDasbboardStats() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    })

    if (!user) throw new Error("User not found")

    const role = user.role as Role
    const now = new Date()
    const last30Days = new Date()
    last30Days.setDate(now.getDate() - 30)

    const prev30Days = new Date()
    prev30Days.setDate(now.getDate() - 60)

    const whereCondition =
        role === "EDITOR" ? { authorId: userId } : {}

    // Current 30 days
    const [postsCount, likesCount, commentsCount, viewsCount] = await Promise.all([
        prisma.post.count({
            where: {
                ...whereCondition, createdAt: { gte: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.like.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.comment.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.view.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
    ])

    // Previous 30 days
    const [prevPosts, prevLikes, prevComments, prevViews] = await Promise.all([
        prisma.post.count({
            where: {
                ...whereCondition, createdAt: { gte: prev30Days, lt: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.like.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: prev30Days, lt: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.comment.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: prev30Days, lt: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
        prisma.view.count({
            where: {
                post: { ...whereCondition }, createdAt: { gte: prev30Days, lt: last30Days }
            }, cacheStrategy: { swr: 30 * 60, ttl: 30 * 60 }
        }),
    ])

    // Calculate % change
    const change = (current: number, previous: number) =>
        previous === 0 ? 100 : ((current - previous) / previous) * 100

    return {
        viewsCount,
        viewsChange: change(viewsCount, prevViews),
        totalLikes: likesCount,
        likesChange: change(likesCount, prevLikes),
        totalComments: commentsCount,
        commentsChange: change(commentsCount, prevComments),
        totalPosts: postsCount,
        postsChange: change(postsCount, prevPosts),
    }
}

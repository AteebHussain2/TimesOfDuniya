'use server';

import prisma from "@/lib/prisma";

export async function GetPostsBySearchQuery(query: string) {
    return await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive'
                    },
                },
                {
                    content: {
                        contains: query,
                        mode: 'insensitive'
                    },
                },
                {
                    tags: {
                        some: {
                            name: {
                                contains: query,
                                mode: 'insensitive'
                            },
                        },
                    },
                },
                {
                    category: {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        },
                    },
                },
                {
                    author: {
                        OR: [
                            {
                                fullname: {
                                    contains: query,
                                    mode: 'insensitive'
                                },
                            },
                            {
                                username: {
                                    contains: query,
                                    mode: 'insensitive'
                                },
                            },
                            {
                                firstName: {
                                    contains: query,
                                    mode: 'insensitive'
                                },
                            },
                            {
                                lastName: {
                                    contains: query,
                                    mode: 'insensitive'
                                },
                            },
                        ],
                    },
                },
            ],
            published: true,
            publishedAt: {
                not: null
            },
        },
        orderBy: {
            publishedAt: 'desc'
        },
        include: {
            author: true,
            category: true,
            tags: true,
            views: true,
            likes: true,
            comments: true,
        },
    });
};
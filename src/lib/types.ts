import { GetCategoriesWithPosts } from "@/actions/dashboard/category/getCategoriesWithPosts";
import { GetPostByIdAndSlug } from "@/actions/dashboard/posts/getPostByIdAndSlug";
import { GetAllPublishedPosts } from "@/actions/site/posts/getAllPublishedPosts";
import { GetUserDataByUserId } from "@/actions/dashboard/getUserDataByUserId";
import { GetCategories } from "@/actions/dashboard/category/getCategories";
import { GetAllUsersData } from "@/actions/dashboard/getAllUsersData";
import { GetLatestPosts } from "@/actions/site/posts/getLatestPosts";
import { GetAllPosts } from "@/actions/dashboard/posts/getAllPosts";
import { GetAllTags } from "@/actions/dashboard/tags/getAllTags";

export type TypeGetAllUsersData = Awaited<ReturnType<typeof GetAllUsersData>>;
export type TypeGetUserDataByUserId = Awaited<ReturnType<typeof GetUserDataByUserId>>;

// Type Tags*
export type TypeGetAllTags = Awaited<ReturnType<typeof GetAllTags>>;

// Type Posts*
export type TypePost = {
    id: number,
    thumbnail: string,
    title: string,
    slug: string,
    summary?: string,
    content: string,
    published: boolean,

    publishedAt?: Date,
    createdAt: Date,
    updatedAt?: Date,

    views: number,
    likes: number,
    labels: string[],

    authorId: string,
    author: {
        id: string,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        role: 'ADMIN' | 'EDITOR' | 'MODERATOR' | 'MEMBER',
        imageUrl: string,
        createdAt: Date,
        updatedAt?: Date
    },

    categoryId: number,
    category: {
        id: number,
        name: string,
        slug: string,
        description?: string,
        createdAt: Date,
        updatedAt?: Date,
    }

    tags: {
        id: number,
        name: string,
    }[]
};
export type TypeGetAllPosts = Awaited<ReturnType<typeof GetAllPosts>>;
export type TypeGetPostByIdAndSlug = Awaited<ReturnType<typeof GetPostByIdAndSlug>>;
export type TypeGetLatestPosts = Awaited<ReturnType<typeof GetLatestPosts>>
export type TypeGetAllPublishedPosts = Awaited<ReturnType<typeof GetAllPublishedPosts>>

// Type Categories*
export type TypeGetCategories = Awaited<ReturnType<typeof GetCategories>>;
export type TypeGetCategoriesWithPosts = Awaited<ReturnType<typeof GetCategoriesWithPosts>>;

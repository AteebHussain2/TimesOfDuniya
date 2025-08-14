import { GetCategoriesWithPosts } from "@/actions/dashboard/category/getCategoriesWithPosts";
import { GetCommentsByPostId } from "@/actions/site/comments/getCommentsByPostId";
import { GetPostByIdAndSlug } from "@/actions/dashboard/posts/getPostByIdAndSlug";
import { GetAllPublishedPosts } from "@/actions/site/posts/getAllPublishedPosts";
import { GetUserDataByUserId } from "@/actions/dashboard/getUserDataByUserId";
import { GetPostsByCategory } from "@/actions/site/posts/getPostsByCategory";
import { GetCategories } from "@/actions/dashboard/category/getCategories";
import { GetAllUsersData } from "@/actions/dashboard/getAllUsersData";
import { GetLatestPosts } from "@/actions/site/posts/getLatestPosts";
import { GetAllPosts } from "@/actions/dashboard/posts/getAllPosts";
import { GetAllTags } from "@/actions/dashboard/tags/getAllTags";
import { GetExcludedTitles } from "@/actions/dashboard/posts/getExcludedTitles";
import { GetPendingJobs } from "@/actions/dashboard/jobs/getPendingJobs";

export type TypeGetAllUsersData = Awaited<ReturnType<typeof GetAllUsersData>>;
export type TypeGetUserDataByUserId = Awaited<ReturnType<typeof GetUserDataByUserId>>;

// Type Tags*
export type TypeGetAllTags = Awaited<ReturnType<typeof GetAllTags>>;

// Type Posts*
export type TypeGetAllPosts = Awaited<ReturnType<typeof GetAllPosts>>;
export type TypeGetPostByIdAndSlug = Awaited<ReturnType<typeof GetPostByIdAndSlug>>;
export type TypeGetLatestPosts = Awaited<ReturnType<typeof GetLatestPosts>>
export type TypeGetAllPublishedPosts = Awaited<ReturnType<typeof GetAllPublishedPosts>>
export type TypeGetPostsByCategory = Awaited<ReturnType<typeof GetPostsByCategory>>
export type TypesGetExcludedTitles = Awaited<ReturnType<typeof GetExcludedTitles>>

// Type Categories*
export type TypeGetCategories = Awaited<ReturnType<typeof GetCategories>>;
export type TypeGetCategoriesWithPosts = Awaited<ReturnType<typeof GetCategoriesWithPosts>>;

// Type Comments*
export type TypeGetCommentByPostId = Awaited<ReturnType<typeof GetCommentsByPostId>>;

// Type Jobs*
export type TypeGetPendingJobs = Awaited<ReturnType<typeof GetPendingJobs>>;

export type TypeJobWithTopics = {
    id: number;
    error: string | null;
    categoryId: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'QUEUED';
    type: 'TOPIC_GENERATION' | 'ARTICLE_GENERATION';
    trigger: string;
    totalItems: number;
    completedItems: number;
    createdAt: Date;
    updatedAt: Date;
    topics: {
        id: number;
        title: string;
        status: string;
        createdAt: Date;
        source: string;
        summary: string;
    }[];
};
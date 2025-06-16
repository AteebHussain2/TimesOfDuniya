import { GetCategoriesWithPosts } from "@/actions/dashboard/category/getCategoriesWithPosts";
import { GetPostByIdAndSlug } from "@/actions/dashboard/posts/getPostByIdAndSlug";
import { GetUserDataByUserId } from "@/actions/dashboard/getUserDataByUserId";
import { GetCategories } from "@/actions/dashboard/category/getCategories";
import { GetAllUsersData } from "@/actions/dashboard/getAllUsersData";
import { GetAllPosts } from "@/actions/dashboard/posts/getAllPosts";
import { GetAllTags } from "@/actions/dashboard/tags/getAllTags";

export type TypeGetAllUsersData = Awaited<ReturnType<typeof GetAllUsersData>>;
export type TypeGetUserDataByUserId = Awaited<ReturnType<typeof GetUserDataByUserId>>;

// Type Tags*
export type TypeGetAllTags = Awaited<ReturnType<typeof GetAllTags>>;

// Type Posts*
export type TypeGetAllPosts = Awaited<ReturnType<typeof GetAllPosts>>;
export type TypeGetPostByIdAndSlug = Awaited<ReturnType<typeof GetPostByIdAndSlug>>;

// Type Categories*
export type TypeGetCategories = Awaited<ReturnType<typeof GetCategories>>;
export type TypeGetCategoriesWithPosts = Awaited<ReturnType<typeof GetCategoriesWithPosts>>;

import { GetCategories } from "@/actions/dashboard/category/getCategories"
import { GetAllPosts } from "@/actions/dashboard/posts/getAllPosts";
import PostsTable from "./_components/PostsTable";

interface Props {
    searchParams: Promise<{
        category: string,
    }>,
};

const page = async ({ searchParams }: Props) => {
    const category = (await searchParams).category;
    const posts = await GetAllPosts(category);
    const categories = await GetCategories();

    return (
        <div className="w-full flex flex-col items-start gap-8">
            <h1 className="text-3xl text-primary font-semibold px-6">
                Manage Content
            </h1>

            <div className="flex flex-col items-start">
                <PostsTable categories={categories} posts={posts} />
            </div>
        </div>
    )
}

export default page
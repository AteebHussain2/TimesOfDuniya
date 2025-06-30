import { GetCategories } from "@/actions/dashboard/category/getCategories"
import { GetAllPosts } from "@/actions/dashboard/posts/getAllPosts";
import ContentManagement from "./_components/ContentManagement";

interface Props {
    searchParams: Promise<{
        category: string,
    }>,
};

const page = async ({ searchParams }: Props) => {
    const params = await searchParams
    const posts = await GetAllPosts();
    const categories = await GetCategories();

    return (
        <div className="max-w-screen min-w-screen md:max-w-[calc(100vw-280px)] md:min-w-[calc(100vw-280px)] flex flex-col items-start gap-8 py-4">
            <h1 className="text-3xl text-primary font-semibold px-6">Manage Content</h1>

            <ContentManagement initialPosts={posts} categories={categories} initialParams={params} />
        </div>
    )
}

export default page;
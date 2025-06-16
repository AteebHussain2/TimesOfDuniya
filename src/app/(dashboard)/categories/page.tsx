import { GetCategoriesWithPosts } from "@/actions/dashboard/category/getCategoriesWithPosts"
import CategoriesHeader from "./_components/CategoriesHeader"
import AllCategories from "./_components/AllCategories"

const page = async () => {
    const categories = await GetCategoriesWithPosts();

    return (
        <div className="w-screen md:w-[calc(100vw-280px)] flex flex-col items-start">
            <CategoriesHeader />

            <AllCategories categories={categories} />
        </div>
    );
};

export default page;
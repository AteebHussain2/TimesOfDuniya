import { GetCategoriesWithPosts } from "@/actions/dashboard/category/getCategoriesWithPosts";
import CategoryManagement from "./_components/CategoryManagement";
import CategoriesHeader from "./_components/CategoriesHeader";

const page = async () => {
    const categories = await GetCategoriesWithPosts();

    return (
        <div className="w-screen md:w-[calc(100vw-280px)] flex flex-col items-start gap-3">
            <CategoriesHeader />
            <CategoryManagement categories={categories} />
        </div>
    );
};

export default page;
'use client';

import { useSearchParams } from "next/navigation";
import { TypeGetCategories } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
    categories: TypeGetCategories,
};

const CategoriesHeader = ({ categories }: Props) => {
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';

    return (
        <div className="w-screen md:w-[calc(100vw-280px)]">
            <div className="relative border-b border-separate">
                <div className="max-w-[20px] w-full max-h-[30px] h-full z-10 absolute top-0 left-0 bg-gradient-to-l from-transparent to-background"></div>
                <div className="max-w-[40px] w-full max-h-[30px] h-full z-10 absolute top-0 right-0 bg-gradient-to-r from-transparent to-background"></div>
                <div className="px-10 overflow-x-auto hide-scrollbar flex items-center gap-7 text-muted-foreground font-semibold">
                    <Link
                        href={`/content`}
                        className={cn("min-w-[40px] text-center cursor-pointer border-b-3 border-transparent transition-all pb-4",
                            (selectedCategory === '' || !selectedCategory) ? 'text-primary border-primary' : 'hover:border-muted-foreground'
                        )}
                    >
                        All
                    </Link>
                    {categories?.map((category: TypeGetCategories[number]) => (
                        <Link
                            key={category.id}
                            href={`?` + new URLSearchParams(`category=${category.slug}`).toString()}
                            className={cn("text-center cursor-pointer border-b-3 border-transparent transition-all pb-4",
                                selectedCategory === category.slug ? 'text-primary border-primary' : 'hover:border-muted-foreground'
                            )}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default CategoriesHeader;
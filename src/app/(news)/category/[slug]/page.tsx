import { GetPostsByCategory } from "@/actions/site/posts/getPostsByCategory";
import { GetCategories } from "@/actions/site/categories/getCategories";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/posts/PostCard";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

let categories = ["international", "pakistan", "politics", "business", "technology", "sports", "health", "entertainment", "anime"];
categories = (await GetCategories()).map(category => category.slug);

const categoryDescriptions = {
    international: "Global news and international affairs from around the world",
    pakistan: "Latest news and updates from Pakistan",
    politics: "Political developments and government affairs",
    business: "Business news, market updates, and economic analysis",
    technology: "Tech news, innovations, and digital trends",
    sports: "Sports news, scores, and athletic achievements",
    health: "Health news, medical breakthroughs, and wellness tips",
    entertainment: "Entertainment news, celebrity updates, and cultural events",
    anime: "Anime news, updates, new releases and sneak peeks"
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    if (!categories.includes(slug.toLowerCase())) {
        notFound()
    };

    const posts = await GetPostsByCategory(slug)
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
    const description = categoryDescriptions[slug.toLowerCase() as keyof typeof categoryDescriptions]

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-4">{categoryName}</h1>
                    <p className="text-lg text-muted-foreground">{description}</p>
                    <Separator className="mt-4" />
                </div>


                {/* Posts Grid */}
                {posts.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {posts.map((post, index) => (
                            <React.Fragment key={post.id}>
                                <PostCard key={post.id} sideFeatured={index % 9 === 0} side={index % 18 !== 0 ? 'left' : 'right'} last post={post} showAuthor={false} showCategory={false} showLikes showViews />
                                <Separator className={cn(index % 9 !== 0 ? 'hidden' : 'block')} />
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No posts found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

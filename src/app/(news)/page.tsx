import { GetAllPublishedPosts } from "@/actions/site/posts/getAllPublishedPosts";
import BreakingNewsTicker from "@/components/posts/BreakingNewsTicker";
import TrendingSidebar from "@/components/posts/TrendingSidebar";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
    const posts = await GetAllPublishedPosts();

    if (posts) {
        const featuredPost = posts[0]
        const latestPosts = posts.slice(1, 6)
        const categories = ["International", "Pakistan", "Technology", "Sports", "Business", "Health", "Entertainment", "Anime"]

        const getPostsByCategory = (category: string, limit = 6) => {
            return posts.filter((post) => post.category?.name === category).slice(0, limit)
        }

        return (
            <div className="min-h-screen bg-background">
                <BreakingNewsTicker />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                        <div className="lg:col-span-3 space-y-6">
                            {/* Featured Post */}
                            <PostCard post={featuredPost} featured={true} showViews={true} />

                            {/* Latest News - Horizontal Layout */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 pb-2 border-b border-border">Latest News</h2>
                                <div className="space-y-3">
                                    {latestPosts.map((post, index) => (
                                        <PostCard key={post.id} last={latestPosts.length === index + 1} post={post} compact={true} showViews={true} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Only on desktop */}
                        <div className="hidden lg:block">
                            <TrendingSidebar />
                        </div>
                    </div>

                    {/* Category Sections - Horizontal Layout */}
                    <div className="space-y-8">
                        {categories.map((category, index) => {
                            const categoryPosts = getPostsByCategory(category, 5)
                            if (categoryPosts.length === 0) return null
                            const featuredPost = categoryPosts[0]
                            const otherPosts = categoryPosts.slice(1, 4)

                            return (
                                <section key={category} className="border-t border-border pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-foreground">{category}</h2>
                                        <Button variant="ghost" size="sm" asChild className="text-rose-600 hover:text-rose-700">
                                            <Link href={`/category/${category.toLowerCase()}`} className="flex items-center text-sm">
                                                More {category} <ArrowRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </Button>
                                    </div>

                                    <PostCard last={categoryPosts.length === 1} post={featuredPost} sideFeatured={true} side={index % 2 === 0 ? 'right' : 'left'} showViews={true} showCategory={false} />

                                    <div className="md:flex flex-wrap gap-4 space-y-3">
                                        {otherPosts.map((post, index) => (
                                            <PostCard key={post.id} post={post} last={categoryPosts.length === index + 1} showAuthor={false} showCategory={false} />
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>

                    {/* Mobile Trending Section */}
                    <div className="lg:hidden mt-8 pt-6 border-t border-border">
                        <TrendingSidebar />
                    </div>

                    {/* Newsletter CTA */}
                    <Card className="mt-12 bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-700 dark:to-pink-700 text-white border-0">
                        <CardContent className="p-6 md:p-8 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
                            <p className="text-base md:text-lg mb-6 opacity-90">
                                Subscribe to our newsletter and never miss the latest news and updates
                            </p>
                            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-white text-gray-900 border-white sm:rounded-r-none"
                                />
                                <Button className="bg-white text-rose-600 hover:bg-gray-100 border-white sm:rounded-l-none">
                                    Subscribe
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }
}
import { MoreLikeThis, TrendingPosts } from "@/components/RecommendationSections";
import { GetPostsByCategory } from "@/actions/site/posts/getPostsByCategory";
import { GetPostByIdAndSlug } from "@/actions/site/posts/getPostByIdAndSlug";
import { ImageWithSkeleton } from "@/components/loading/image-skeleton";
import CommentSection from "@/components/posts/CommentSection";
import PostEngagement from "@/components/posts/PostEngagement";
import ShareButton from "@/components/posts/ShareButton";
import PostCard from "@/components/posts/PostCard";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { Image } from "@imagekit/next";
import Markdown from "react-markdown";
import type { Metadata } from "next";
import Link from "next/link";

interface Props {
    params: Promise<{
        postId: string,
        slug: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { postId, slug } = await params;
    const post = await GetPostByIdAndSlug(Number(postId), slug);

    if (!post) return {};

    return {
        title: post.title,
        description: post.summary || "Read latest news on Times Of Duniya.",
        openGraph: {
            title: post.title,
            description: post.summary || "Stay informed with Times Of Duniya.",
            url: `https://times-of-duniya.vercel.app/post/${post.id}/${post.slug}`,
            siteName: "Times Of Duniya",
            images: [
                {
                    url: post.thumbnail,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.summary || "",
            images: [post.thumbnail],
        },
    };
};

export default async function PostPage({ params }: Props) {
    const { postId, slug } = await params;
    const post = await GetPostByIdAndSlug(Number(postId), slug);
    if (!post) {
        notFound()
    }
    const { id, title, thumbnail, content, summary, category, author, publishedAt, views, likes, comments, tags } = post;

    // Safe access to category with fallback
    const relatedPosts = category?.name ? await GetPostsByCategory(category?.name) : [];

    return (
        <div className="min-h-screen bg-background">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Article Header */}
                <header className="mb-8">
                    <div className="mb-4">
                        <Link
                            href={`/category/${(category?.name || "uncategorized").toLowerCase()}`}
                            className="inline-block bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-rose-700 transition-colors"
                        >
                            {category?.name || "Uncategorized"}
                        </Link>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                        {title || "Untitled Post"}
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center items-start space-x-6 text-muted-foreground mb-6">
                        <div className="flex items-center space-x-2">
                            <Image
                                src={author.imageUrl || "/placeholder.svg"}
                                alt={author.username}
                                width={40}
                                height={40}
                                className="rounded-full min-w-[40px] min-h-[40px] object-cover"
                            />
                            <Link
                                href={`/author/${author.username}`}
                                className="font-medium hover:text-rose-600 transition-colors"
                            >
                                {author.fullname}
                            </Link>
                        </div>

                        <Calendar className="h-4 w-4" />
                        <span>
                            {formatDistanceToNow(publishedAt!, { addSuffix: true })}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-8">
                        <ShareButton />
                    </div>
                </header>

                {/* Article Stats */}
                <PostEngagement
                    postId={id}
                    postSlug={post.slug}
                    initialViews={views.length || 0}
                    initialLikes={likes.length || 0}
                    initialCommentCount={comments.length || 0}
                />

                {/* Featured Image */}
                <div className="mb-8">
                    <ImageWithSkeleton
                        src={thumbnail}
                        alt={title}
                        fill
                        aspectRatio="video"
                        className="rounded-lg overflow-hidden"
                        priority
                    />
                </div>

                {/* Article Content */}
                <div className="max-w-none mb-8">
                    <p className="text-xl text-muted-foreground font-medium mb-6">{summary || "No summary available"}</p>
                    <div className="rich-text-editor">
                        {(content || "No content available").split("\n").map((paragraph, index) => (
                            <Markdown key={`paragraph-${index}`}>
                                {paragraph}
                            </Markdown>
                        ))}
                    </div>
                </div>

                {/* Recommendation Sections */}
                <div className="mb-12">
                    <MoreLikeThis currentPost={post} />
                    <TrendingPosts limit={4} />
                </div>

                {/* Tags */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={"secondary"}
                                className="px-3 py-1 rounded-full text-sm"
                            >
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Comment Section */}
                <CommentSection postId={id} postSlug={slug} />
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-gray-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <PostCard key={relatedPost.id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div >
    )
}

import { GetJobWithTopicsAndArticlesById } from "@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LinkIcon, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ArticleFileUpload from "./ArticleFileUpload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getStatusColor, getStatusIcon } from "@/lib/job";

export async function ArticlePreview({ job, topicId }: { job: Awaited<ReturnType<typeof GetJobWithTopicsAndArticlesById>>, topicId: number }) {
    const currentTopic = job?.topics.find((topic) => topic.id === Number(topicId));
    const currentArticle = job?.articles.find((article) => article.topicId === Number(topicId));

    if (!job || !currentTopic) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
                    <p className="text-muted-foreground mb-4">The requested job or topic could not be found.</p>
                    <Link href="/jobs">
                        <Button>Back to Jobs</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full sm:max-w-[80%] mx-auto flex-1 overflow-auto">
            <div className="my-6">
                <h1 className="text-2xl font-bold mb-2">Topic: {currentTopic.title}</h1>
                <Badge
                    variant={'outline'}
                    className={cn("flex items-center gap-2 text-md mb-2 rounded-sm", getStatusColor(currentArticle?.status ?? job?.status))}
                >
                    {getStatusIcon(currentArticle?.status ?? job?.status)} STATUS: {currentArticle?.status ?? job?.status}
                </Badge>
                {(currentArticle?.publishedAt || currentArticle?.publishedUrl) && (
                    <span className="text-sm text-blue-400 hover:underline transition-all flex items-center gap-1 mb-2">
                        <LinkIcon className="h-4 w-4" />
                        <Link
                            target="_blank"
                            href={currentArticle?.publishedUrl || ''}
                        >
                            {currentArticle?.publishedUrl}
                        </Link>
                    </span>
                )}
                <p className="text-muted-foreground">Job ID: {job.id}</p>
            </div>

            {/* Article Content */}
            {currentArticle ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">⬇️ Article Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="pt-2 border-t relative">
                            <ArticleFileUpload id={currentArticle?.id} thumbnail={currentArticle?.thumbnail} published={Boolean(currentArticle?.publishedAt)} />
                        </div>

                        <p className="text-2xl font-bold">{currentArticle.title}</p>

                        <p className="text-muted-foreground text-sm">{currentArticle.summary}</p>


                        <div className="rich-text-editor">
                            <Markdown>
                                {currentArticle.content || "No content available for this article."}
                            </Markdown>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-1">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentArticle.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Source(s)</h3>
                            <div className="flex flex-wrap gap-2">
                                {currentArticle.source.map((source) => (
                                    <a
                                        key={source}
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        {source.split("/").slice(0, 3).join("/")}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Accuracy Score</h3>
                                <p
                                    className={cn(
                                        "font-bold",
                                        currentArticle?.accuracy && (currentArticle?.accuracy >= 90 ? "text-green-600" : currentArticle?.accuracy >= 70 ? "text-yellow-600" : "text-red-600"),
                                    )}
                                >
                                    {currentArticle?.accuracy}%
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Reason</h3>
                                <p className="text-muted-foreground">{currentArticle?.reasoning}</p>
                            </div>
                            <div className="col-span-full">
                                <h3 className="text-lg font-semibold mb-1">Feedback</h3>
                                <p className="text-muted-foreground">{currentArticle?.feedback}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Article Not Generated Yet</h3>
                            <p className="text-muted-foreground">This topic is pending article generation.</p>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* Topic Info */}
            <Card className="my-6">
                <CardHeader>
                    <CardTitle className="text-xl">📝 Topic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold mb-1">{currentTopic.title}</h3>

                    <div>
                        <h3 className="text-lg font-semibold mb-1">Summary</h3>
                        <p className="text-muted-foreground">{currentTopic.summary}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Source(s)</h3>
                        <div className="flex flex-col gap-1 items-start">
                            {currentTopic.source && currentTopic.source.map((s, i) => (
                                <span key={i} className="text-blue-500 flex items-center gap-1 text-xs mt-1">
                                    <LinkIcon className="w-4 h-4" />
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

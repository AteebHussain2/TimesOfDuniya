import ArticleFileUpload from "@/app/(topics)/job/[jobId]/topic/[topicId]/preview/_components/ArticleFileUpload";
import { PublishArticleButton, UnPublishArticleButton } from "@/components/ai/articles-section";
import { GetManualTopicWithJobById } from "@/actions/dashboard/jobs/getManualTopicWithJobById";
import { ArticleReGenerationButton } from "@/components/ai/generated-topics-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, LinkIcon, Tag } from "lucide-react";
import { getStatusColor, getStatusIcon } from "@/lib/job";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TopicDetailPage({ params }: PageProps) {
  const topic = await GetManualTopicWithJobById(Number((await params).id));
  const article = topic.articles[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ai/topics">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Topics
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div className="w-full sm:max-w-[80%] mx-auto flex-1 overflow-auto">
          <div className="my-6 space-y-2">
            <h1 className="text-2xl font-bold mb-2">Topic: {topic.title}</h1>
            <Badge
              variant={'outline'}
              className={cn("flex items-center gap-2 text-md mb-2 rounded-sm", getStatusColor(article?.status ?? topic?.status))}
            >
              {getStatusIcon(article?.status ?? topic?.status)} STATUS: {article?.status ?? topic?.status}
            </Badge>
            {(article.publishedAt && article.publishedUrl) ? (
              <>
                <span className="text-sm text-blue-400 hover:underline transition-all flex items-center gap-1 mb-2">
                  <LinkIcon className="h-4 w-4" />
                  <Link
                    target="_blank"
                    href={article.publishedUrl || ''}
                  >
                    {article.publishedUrl}
                  </Link>
                </span>
                <UnPublishArticleButton article={article} job={topic.job} />
              </>
            ) : (
              <span className="flex flex-wrap gap-3">
                <PublishArticleButton article={article} job={topic.job} />
                <p className="border border-separate rounded-md w-full sm:w-[150px]">
                  <ArticleReGenerationButton articleId={article.id} jobId={article.jobId} topic={topic} />
                </p>
              </span>
            )}
            <p className="text-muted-foreground">Job ID: {topic.job.id}</p>
          </div>

          {/* Article Content */}
          {article ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">⬇️ Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="pt-2 border-t relative">
                  <ArticleFileUpload id={article.id} thumbnail={article.thumbnail} published={Boolean(article.publishedAt)} />
                </div>

                <p className="text-2xl font-bold">{article.title}</p>

                <p className="text-muted-foreground text-sm">{article.summary}</p>


                <div className="rich-text-editor">
                  <Markdown>
                    {article.content || "No content available for this article."}
                  </Markdown>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags && article.tags.map((tag) => (
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
                    {article.source && article.source.map((source) => (
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
                        article.accuracy && (article.accuracy >= 90 ? "text-green-600" : article.accuracy >= 70 ? "text-yellow-600" : "text-red-600"),
                      )}
                    >
                      {article.accuracy}%
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Reason</h3>
                    <p className="text-muted-foreground">{article.reasoning}</p>
                  </div>
                  <div className="col-span-full">
                    <h3 className="text-lg font-semibold mb-1">Feedback</h3>
                    <p className="text-muted-foreground">{article.feedback}</p>
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
                  <p className="text-muted-foreground">This topic is pending for article generation.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
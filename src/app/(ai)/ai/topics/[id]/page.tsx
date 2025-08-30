import ArticleFileUpload from "@/app/(topics)/job/[jobId]/topic/[topicId]/preview/_components/ArticleFileUpload"
import { GetManualTopicWithJobById } from "@/actions/dashboard/jobs/getManualTopicWithJobById"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, LinkIcon } from "lucide-react"
import { getStatusColor, getStatusIcon } from "@/lib/job"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
          <div className="my-6">
            <h1 className="text-2xl font-bold mb-2">Topic: {topic.title}</h1>
            <Badge
              variant={'outline'}
              className={cn("flex items-center gap-2 text-md mb-2 rounded-sm", getStatusColor(article?.status ?? topic?.status))}
            >
              {getStatusIcon(article?.status ?? topic?.status)} STATUS: {article?.status ?? topic?.status}
            </Badge>
            {article && (article.publishedAt && article.publishedUrl) && (
              <span className="text-sm text-blue-400 hover:underline transition-all flex items-center gap-1 mb-2">
                <LinkIcon className="h-4 w-4" />
                <Link
                  target="_blank"
                  href={article.publishedUrl || ''}
                >
                  {article.publishedUrl}
                </Link>
              </span>
            )}
            <p className="text-muted-foreground">Job ID: {topic.job.id}</p>
          </div>

          {/* Topic Info */}
          <Card className="my-6">
            <CardHeader>
              <CardTitle className="text-xl">📝 Topic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold mb-1">{topic.title}</h3>

              <div>
                <h3 className="text-lg font-semibold mb-1">Summary</h3>
                <p className="text-muted-foreground">{topic.summary}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Source(s)</h3>
                <div className="flex flex-col gap-1 items-start">
                  {topic.source && topic.source.map((s, i) => (
                    <span key={i} className="text-blue-500 flex items-center gap-1 text-xs mt-1">
                      <LinkIcon className="w-4 h-4" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

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

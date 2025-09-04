import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PublishArticleButton, UnPublishArticleButton } from "@/components/ai/articles-section";
import { GetAllManualArticles } from "@/actions/dashboard/jobs/getAllManualArticles";
import { ArticleReGenerationButton } from "@/components/ai/generated-topics-section";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function ArticlesPage() {
  const articles = await GetAllManualArticles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generated Articles</h1>
          <p className="text-muted-foreground">View and manage your AI-generated articles</p>
        </div>
        <Button asChild>
          <Link href="/ai">Generate New Content</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{article.summary}</CardDescription>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{article.job.category.name}</Badge>
                    <Badge variant={(article.publishedAt) ? "default" : "secondary"}>{article.publishedAt ? "Published" : "Unpublished"}</Badge>
                    {article.thumbnail && (
                      <Badge variant="outline">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        Image
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">{article.content.length} words</span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-center gap-2">
                  {article.publishedAt && article.publishedUrl ? (
                    <>
                      <Link
                        className={cn("w-full sm:w-[120px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                        href={`/ai/articles/${article?.topicId}`}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Link>
                      <UnPublishArticleButton job={article.job} article={article} />
                    </>
                  ) : (
                    <>
                      <Link
                        className={cn("w-full sm:w-[150px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                        href={`/ai/articles/${article?.topicId}`}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        Preview
                      </Link>
                      <PublishArticleButton article={article} job={article.job} />
                      <ArticleReGenerationButton jobId={article.jobId} topic={article.topic} articleId={article.id} triggerText="Regenerate" width={150} />
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center flex-wrap justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  Created {article.createdAt.toLocaleDateString()}
                </div>
                <span className="last:hidden">
                  •
                </span>
                {article.publishedAt && <div>Published {article.publishedAt.toLocaleDateString()}</div>}
              </div>

              <div className="flex sm:hidden flex-col items-center gap-2">
                {article.publishedAt && article.publishedUrl ? (
                  <>
                    <Link
                      className={cn("w-full sm:w-[120px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                      href={`/ai/articles/${article?.topicId}`}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      View
                    </Link>
                    <UnPublishArticleButton job={article.job} article={article} />
                  </>
                ) : (
                  <>
                    <Link
                      className={cn("w-full sm:w-[120px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                      href={`/ai/articles/${article?.topicId}`}
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Preview
                    </Link>
                    <PublishArticleButton article={article} job={article.job} />
                    <ArticleReGenerationButton jobId={article.jobId} topic={article.topic} articleId={article.id} triggerText="Regenerate" />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

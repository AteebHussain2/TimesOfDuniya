"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import ArticleFileUpload, { ArticleUploadImageButton } from "@/app/(topics)/job/[jobId]/topic/[topicId]/preview/_components/ArticleFileUpload";
import { GetLatestManualArticles } from "@/actions/dashboard/jobs/getLatestManualArticles";
import { FileText, Calendar, Eye, Upload, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublishArticle } from "@/actions/dashboard/jobs/publishArticle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Article, Job, STATUS } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function ArticlesSection() {

  const { data: job, isLoading } = useQuery({
    queryFn: GetLatestManualArticles,
    queryKey: ['latest-manual-articles'],
    refetchInterval: 5 * 1000 // 5 seconds
  })
  const articles = job?.articles || [];

  const getStatusColor = (status: STATUS) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PROCESSING":
        return "secondary"
      case "PENDING":
        return "outline"
      default:
        return "outline"
    }
  }

  if (!job?.id) {
    return <div>Job ID not found!</div>
  }

  return (
    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Articles ({articles && articles.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
              <p>Loading generated articles...</p>
            </div>
          )}

          {articles && articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 space-y-8 bg-background/50">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <h3 className="font-medium leading-tight wrap-break-word">{article.title}</h3>
                  <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                    <Badge variant={getStatusColor(article.status)}>{article.status}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    {article.content.length > 0 && <span>{article.content.length} words</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-col sm:flex-row w-full">
                {article.publishedAt && article.publishedUrl ? (
                  <Link
                    className={cn("w-full sm:w-[120px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                    href={article.publishedUrl}
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    View
                  </Link>
                ) : (
                  <Link
                    className={cn("w-full sm:w-[120px]", buttonVariants({ variant: 'outline', size: 'sm' }))}
                    href={`/ai/articles/${article?.topicId}`}
                  >
                    <Eye className="mr-2 h-3 w-3" />
                    Preview
                  </Link>
                )}

                <PublishArticleButton article={article} job={job} />

                <ArticleUploadImageButton id={article.id} thumbnail={article.thumbnail} published={!!(article.publishedAt && article.publishedUrl)} />
              </div>
            </div>
          ))}

          {articles && articles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No articles generated yet. Generate topics first to create articles!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


export const PublishArticleButton = ({ article, job }: { article: Article, job: Job }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: ({ jobId, topicId }: { jobId: number, topicId: number }) => PublishArticle(jobId, topicId),
    onSuccess: () => toast.success("Artical successfully published!", { id: 'publish-article' }),
    onError: () => toast.error("Something went wrong, Please try again.", { id: 'publish-article' }),
  })

  const handlePublish = (
    e: React.MouseEvent<HTMLButtonElement>,
    article: Article
  ) => {
    e.preventDefault();

    if (!article.thumbnail) {
      setSelectedArticle(article);
      setDialogOpen(true);
      return;
    }

    toast.loading("Publishing article...", { id: "publish-article" });
    mutation.mutate({ jobId: job!.id, topicId: article.topicId });
  };

  return (
    <>
      {/* Thumbnail upload dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Upload Thumbnail Before Publishing
            </AlertDialogTitle>
            <AlertDialogDescription className="text-destructive text-xs font-200">
              Thumbnail Image is required to publish article on site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <ArticleFileUpload
                id={selectedArticle.id}
                thumbnail={selectedArticle.thumbnail}
                published={!!selectedArticle.publishedAt}
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="w-[140px]">
              Cancel
            </AlertDialogCancel>
            {selectedArticle && <AlertDialogAction
              onClick={() => {
                setDialogOpen(false);
                toast.loading("Publishing article...", {
                  id: "publish-article",
                });
                mutation.mutate({
                  jobId: job!.id,
                  topicId: selectedArticle.topicId,
                });
              }}
              disabled={!selectedArticle.thumbnail}
              className="w-[140px]"
            >
              Publish Article
            </AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        onClick={(e) => handlePublish(e, article)}
        disabled={mutation.isPending || article.status === STATUS.FAILED || article.status === STATUS.PROCESSING || !!(article.publishedAt && article.publishedUrl)}
        variant={'secondary'}
        size="sm"
        className="w-full sm:w-[150px]"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Publishing...
          </>
        ) : !(article.publishedAt && article.publishedUrl) ? (
          <>
            <Upload className="mr-2 h-3 w-3" />
            Publish to Site
          </>
        ) : (
          <>
            <CheckCircle className="text-green-400 mr-2 h-3 w-3" />
            Published
          </>
        )}
      </Button>
    </>
  )
}
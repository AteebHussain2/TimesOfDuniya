"use client";

import { GetLatestManualTopics, TopicWithArticles } from "@/actions/dashboard/jobs/getLatestManualTopics";
import { GenerateManualArticle, ReGenerateManualArticle } from "@/actions/dashboard/jobs/generateManualArticle";
import { Lightbulb, Calendar, FileText, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import AIAnimatedLoader from "./ai-animated-loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { STATUS, Topic } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


export function GeneratedTopicsSection() {
  const [articlePrompts, setArticlePrompts] = useState<Record<string, string>>({})

  const { data: job, isLoading } = useQuery({
    queryFn: GetLatestManualTopics,
    queryKey: ["latest-manual-topics"],
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 1000 // 5 seconds
  })

  const topics = job?.topics || []

  return (
    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Generated Topics ({topics && topics.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(topics && topics.length) ? topics.map((topic) => (
            <div key={topic.id} className="border rounded-lg p-4 space-y-8 bg-background/50">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <h3 className="font-medium leading-tight">{topic.title}</h3>
                  <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                    <Badge variant="outline">{job?.category.name}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(topic.createdAt).toLocaleDateString()}
                    </div>
                    <Badge variant={topic.status === STATUS.COMPLETED ? "default" : "secondary"}>{topic.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Optional prompt for article generation..."
                  value={articlePrompts[topic.id] || ""}
                  onChange={(e) => setArticlePrompts((prev) => ({ ...prev, [topic.id]: e.target.value }))}
                />

                <ArticleGenerationButton
                  jobId={job?.id!}
                  topic={topic}
                  articlePrompts={articlePrompts}
                  setArticlePrompts={setArticlePrompts}
                />
              </div>
            </div>
          )) : !isLoading ? (
            <AIAnimatedLoader status={job?.status!} defaultNode={
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No topics generated yet. Use the form above to get started!</p>
              </div>
            } />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
              <p>Loading generated topics...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card >
  )
}


export const ArticleGenerationButton = ({
  jobId,
  topic,
  width,
  triggerText,
  articlePrompts,
  setArticlePrompts,
}: {
  jobId: number,
  topic: TopicWithArticles,
  width?: number,
  triggerText?: string,
  articlePrompts?: Record<string, string>,
  setArticlePrompts?: React.Dispatch<React.SetStateAction<Record<string, string>>>,
}) => {
  const mutation = useMutation({
    mutationFn: ({ topicId, prompt }: { topicId: number, prompt: string }) => GenerateManualArticle({ topicId, jobId, prompt }),
    onSuccess: () => {
      toast.success("Article generation started! Check the Articles section.", { id: 'queue-manual-article' })
    },
    onError: () => toast.error("Failed to start article generation. Please try again.", { id: 'queue-manual-article' })
  });

  return (
    <Button
      onClick={() => {
        toast.loading("Queueing article generation...", { id: 'queue-manual-article' })
        if (setArticlePrompts) {
          setArticlePrompts((prev) => {
            const { [topic.id]: removed, ...rest } = prev;
            return rest;
          })
        }
        mutation.mutate({ topicId: topic.id, prompt: articlePrompts?.[topic.id] || "" })
      }}
      disabled={mutation.isPending || (topic.status !== STATUS.FAILED && topic.status !== STATUS.COMPLETED) || (topic.articles && topic.articles.length !== 0)}
      size="sm"
      variant={'secondary'}
      className={cn(width ? `w-[${width}px]` : "w-full")}
    >
      {mutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          {triggerText ? `${triggerText.slice(0, -1)}ing...` : "Generating Article..."}
        </>
      ) : !(topic.articles && topic.articles.length !== 0) ? (
        <>
          <FileText className="mr-2 h-3 w-3" />
          {triggerText ? triggerText : "Generate Article"}
        </>
      ) : (
        <>
          <CheckCircle className="text-green-400 mr-2 h-3 w-3" />
          {triggerText ? `${triggerText}d` : "Article Generated"}
        </>
      )}
    </Button>
  )
}


export const ArticleReGenerationButton = ({
  articleId,
  jobId,
  topic,
  width,
  triggerText,
  articlePrompts,
  setArticlePrompts,
}: {
  jobId: number,
  articleId: number,
  topic: Topic,
  width?: number,
  triggerText?: string,
  articlePrompts?: Record<string, string>,
  setArticlePrompts?: React.Dispatch<React.SetStateAction<Record<string, string>>>,
}) => {
  const mutation = useMutation({
    mutationFn: ({ topicId, prompt }: { topicId: number, prompt: string }) => ReGenerateManualArticle({ articleId, topicId, jobId, prompt }),
    onSuccess: () => {
      toast.success("Article regeneration started! Check the Articles section.", { id: 'queue-manual-article' })
    },
    onError: () => toast.error("Failed to regenerate article. Please try again.", { id: 'queue-manual-article' })
  });

  return (
    <Button
      onClick={() => {
        toast.loading("Queueing article regeneration...", { id: 'queue-manual-article' })
        if (setArticlePrompts) {
          setArticlePrompts((prev) => {
            const { [topic.id]: removed, ...rest } = prev;
            return rest;
          })
        }
        mutation.mutate({ topicId: topic.id, prompt: articlePrompts?.[topic.id] || "" })
      }}
      disabled={mutation.isPending || (topic.status !== STATUS.FAILED && topic.status !== STATUS.COMPLETED)}
      size="sm"
      variant={'ghost'}
      className={cn(width ? `w-[${width}px]` : "w-full")}
    >
      {mutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          {triggerText ? `${triggerText.slice(0, -1)}ing...` : "Generating Article..."}
        </>
      ) : (
        <>
          <FileText className="mr-2 h-3 w-3" />
          {triggerText ? triggerText : "Generate Article"}
        </>
      )}
    </Button>
  )
}
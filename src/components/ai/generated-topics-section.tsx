"use client";

import { GetLatestManualTopics } from "@/actions/dashboard/jobs/getLatestManualTopics";
import { GenerateManualArticle } from "@/actions/dashboard/jobs/generateManualArticle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, FileText, Loader2, CheckCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { STATUS } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";


export function GeneratedTopicsSection() {
  const [articlePrompts, setArticlePrompts] = useState<Record<string, string>>({})

  const { data: job, isLoading } = useQuery({
    queryFn: GetLatestManualTopics,
    queryKey: ["latest-manual-topics"],
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 1000 // 5 seconds
  })

  const topics = job?.topics || []

  const mutation = useMutation({
    mutationFn: ({ topicId, prompt }: { topicId: number, prompt: string }) => GenerateManualArticle({ topicId, jobId: job?.id, prompt }),
    onSuccess: () => {
      toast.success("Article generation started! Check the Articles section.", { id: 'queue-manual-article' })
    },
    onError: () => toast.error("Failed to start article generation. Please try again.", { id: 'queue-manual-article' })
  });

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
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin opacity-50" />
              <p>Loading generated topics...</p>
            </div>
          )}

          {topics && topics.map((topic) => (
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
                <Button
                  onClick={() => {
                    toast.loading("Queueing article generation...", { id: 'queue-manual-article' })
                    setArticlePrompts((prev) => {
                      const { [topic.id]: removed, ...rest } = prev;
                      return rest;
                    })
                    mutation.mutate({ topicId: topic.id, prompt: articlePrompts[topic.id] || "" })
                  }}
                  disabled={mutation.isPending || topic.status !== STATUS.COMPLETED || (topic.articles && topic.articles.length !== 0)}
                  size="sm"
                  variant={'secondary'}
                  className="w-full"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Generating Article...
                    </>
                  ) : !(topic.articles && topic.articles.length !== 0) ? (
                    <>
                      <FileText className="mr-2 h-3 w-3" />
                      Generate Article
                    </>
                  ) : (
                    <>
                      <CheckCircle className="text-green-400 mr-2 h-3 w-3" />
                      Article Generated
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {!isLoading && topics && topics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No topics generated yet. Use the form above to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

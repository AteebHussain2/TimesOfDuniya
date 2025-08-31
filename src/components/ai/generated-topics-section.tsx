"use client";

import { GetLatestManualTopics, TopicWithArticles } from "@/actions/dashboard/jobs/getLatestManualTopics";
import { GenerateManualArticle } from "@/actions/dashboard/jobs/generateManualArticle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Calendar, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Job, STATUS, Topic } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import AIAnimatedLoader from "./ai-animated-loader";


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
  articlePrompts,
  setArticlePrompts,
}: {
  jobId: number,
  topic: TopicWithArticles,
  articlePrompts: Record<string, string>,
  setArticlePrompts: React.Dispatch<React.SetStateAction<Record<string, string>>>,
}) => {
  const mutation = useMutation({
    mutationFn: ({ topicId, prompt }: { topicId: number, prompt: string }) => GenerateManualArticle({ topicId, jobId: jobId, prompt }),
    onSuccess: () => {
      toast.success("Article generation started! Check the Articles section.", { id: 'queue-manual-article' })
    },
    onError: () => toast.error("Failed to start article generation. Please try again.", { id: 'queue-manual-article' })
  });

  return (
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
  )
}



export function TopicDisplay({ status }: { status: STATUS }) {
  if (status !== STATUS.COMPLETED && status !== STATUS.FAILED) {
    return (
      <div className="w-full">
        {/* Spinner with message */}
        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating topics…</span>
        </div>

        {/* Simulated AI writing area */}
        <div className="relative w-full h-44 rounded-xl bg-muted overflow-hidden">
          {/* Scrolling dummy article */}
          <div className="absolute inset-0 px-6 space-y-8 animate-scroll">
            <p className="text-lg text-muted-foreground/80 animate-fade delay-0">
              Germany's unemployment figures have surpassed the three million mark for the first time in ten years, reaching 3.025 million in August 2025. This marks a significant milestone, with the unemployment rate climbing to 6.4%. Experts attribute the rise partly to seasonal factors and anticipate a marginal increase in the coming months.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-300">
              International organizations and the Pakistani government are mobilizing resources to assist communities in Punjab affected by recent devastating floods. Relief efforts include the distribution of essential supplies such as food, clean water, and medical assistance.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-600">
              Researchers at the Massachusetts Institute of Technology (MIT) have developed an artificial intelligence system named VaxSeer, designed to enhance the process of selecting influenza vaccine strains. By leveraging machine learning, VaxSeer predicts dominant flu strains months in advance and identifies vaccine candidates offering superior protection.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              The globally acclaimed manga series *One Piece*, created by Eiichiro Oda, is currently on hiatus, leading to fan concern, largely attributed to potential health issues of the creator. While major international news outlets have not extensively detailed the reasons, fan communities suggest health-related breaks, referencing Oda's past health challenges. The manga's Chapter 1158 is anticipated around August 31, 2025. The series maintains immense cultural significance, evidenced by its successful Netflix live-action adaptation and its recognition for scale, such as being the longest single-volume book. Fan anxiety highlights the deep connection to both the narrative and its creator, awaiting further updates.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              Ukraine reported that Russia launched one of its most significant aerial assaults in weeks overnight, deploying 574 drones and missiles. The strikes, which hit multiple regions including Kyiv, primarily aimed at energy infrastructure, resulting in at least one fatality and several injuries.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              Alphabet's stock experienced a notable increase following reports suggesting that Apple plans to integrate Google's Gemini AI into its Siri virtual assistant. This development could signify a significant shift in the AI landscape and partnerships between major tech players.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              The U.S. government has officially taken a 10% equity stake in chipmaker Intel, representing an $8.9 billion investment in the company's common stock. Announced by President Trump and confirmed by Commerce Secretary Howard Lutnick, the deal is part of a broader initiative to bolster American technology firms.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              Artificial Intelligence (AI) is revolutionizing education by enabling personalized learning, enhancing teaching methods, and improving administrative efficiency. However, ethical challenges including bias, privacy, transparency, and equity must be carefully managed to ensure responsible implementation and equitable access for all students.
            </p>
            <p className="text-lg text-muted-foreground/80 animate-fade delay-900">
              As AI becomes more integrated into education, the role of teachers is evolving. Teachers are becoming facilitators, guiding students in using AI tools effectively and fostering critical thinking skills. Professional development and training are essential to prepare educators for this changing landscape.
            </p>
          </div>

          {/* Blur overlay for mystery */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-background/20" />
        </div>
      </div>
    );
  }


  if (status === STATUS.COMPLETED) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No topics generated yet. Use the form above to get started!</p>
      </div>
    )
  }

  if (status === STATUS.FAILED) {
    return (
      <div className="flex items-center gap-2 text-destructive font-medium">
        <AlertCircle className="h-5 w-5" />
        <span>Generation failed. Please try again!</span>
      </div>
    )
  }
}
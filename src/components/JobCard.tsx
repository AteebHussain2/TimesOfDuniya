"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, CheckCircle, XCircle, Clock, Loader2, LinkIcon, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExecuteJob } from "@/actions/dashboard/jobs/executeJob";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TypeJobWithTopics } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { STATUS, TYPE } from "@prisma/client";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";

interface JobCardProps {
  job: TypeJobWithTopics,
  showGenerateButton: boolean
}

export function JobCard({ job, showGenerateButton }: JobCardProps) {
  const getStatusIcon = (status: STATUS) => {
    switch (status) {
      case STATUS.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case STATUS.FAILED:
        return <XCircle className="w-4 h-4 text-red-600" />
      case STATUS.PENDING:
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: STATUS) => {
    switch (status) {
      case STATUS.COMPLETED:
        return "text-green-800 dark:text-green-600 border-green-800 dark:border-green-600"
      case STATUS.FAILED:
        return "text-[var(--color-destructive)] border-[var(--color-destructive)]"
      case STATUS.PENDING:
        return "text-yellow-800 dark:text-yellow-400 border-yellow-800 dark:border-yellow-400"
      case STATUS.QUEUED:
        return "text-blue-800 dark:text-blue-400 border-blue-800 dark:border-blue-400"
      default:
        return "text-[var(--color-border)] border-[var(--color-border)]"
    }
  }

  const getJobType = (type: TYPE) => {
    switch (type) {
      case TYPE.TOPIC_GENERATION:
        return "Topics"
      case TYPE.ARTICLE_GENERATION:
        return "Articles"
    };
  };

  const retryMutation = useMutation({
    mutationFn: async ({ jobId }: { jobId: number }) => await ExecuteJob(jobId),
    onSuccess: () => toast.success('Successfuly added process to queue!'),
    onError: (error) => toast.error(error instanceof Error ? error.message : String(error)),
  });

  const handleGenerateClick = (e: React.MouseEvent, jobId: number) => {
    e.stopPropagation();

    retryMutation.mutate({ jobId });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between w-full mr-4">
          <CardTitle>
            <div className="flex items-center gap-3">
              {getStatusIcon(job.status)}
              <div className="text-left">
                <h3 className="font-semibold">Job ID: {job.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {getJobType(job.type)} • {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={'outline'} className={cn('!rounded-[2px]', getStatusColor(job.status))}>{job.status}</Badge>
            {(showGenerateButton) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      size={'sm'}
                      className="ml-auto"
                      onClick={(e) => handleGenerateClick(e, job?.id)}
                      disabled={retryMutation.isPending}
                    >
                      {retryMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span className="sr-only">Generate Article</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!retryMutation.isPending ? <p>Generate {(job?.type === TYPE.TOPIC_GENERATION) ? "topics" : "articles"} for this job</p> : <p>Generating...</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {(job?.status === STATUS.PENDING && job?.type === TYPE.ARTICLE_GENERATION) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/job/${job.id}/topic/${job.topics[0].id}/preview`} className="flex items-center gap-2">
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="ml-auto"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span className="sr-only">Publish Article</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View and publish articles for this job</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-6">
        <div className="space-y-4">
          {job.topics.length > 0 ? (
            job.topics.map((topic) => (
              <React.Fragment key={topic.id} >
                <Link href={`/job/${job.id}/topic/${topic.id}/preview`} className="flex flex-col p-2 rounded-sm pb-2 hover:bg-accent transition-colors">
                  <h4 className="font-medium">{topic.title}</h4>
                  <p className="text-sm text-muted-foreground">{topic.summary}</p>
                  <div className="flex flex-col gap-1 items-start">
                    {topic.source && topic.source.map(s => (
                      <span className="text-blue-500 flex items-center gap-1 text-xs mt-1">
                        <LinkIcon className="w-3 h-3" />
                        {s.split("/").slice(0, 3).join("/")}
                      </span>
                    ))}
                  </div>
                </Link >
                <Separator className="last:hidden" />
              </React.Fragment>
            ))
          ) : (
            <div
              className="text-sm"
              style={{ maxWidth: "40%" }}
            >
              {job.status === STATUS.QUEUED ? (
                <p className="text-green-800 dark:text-green-600 truncate">You request for this job has been queued...</p>
              ) : (
                job.error && <p className="text-destructive truncate">{job.error}</p>
              ) || <p className="text-yellow-800 dark:text-yellow-600">No error message</p>
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card >
  )
}

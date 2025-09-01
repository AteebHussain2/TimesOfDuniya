"use client"

import { GetJobWithTopicsAndArticlesById } from "@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById";
import { getStatusColor, getStatusIcon } from "@/lib/job";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Card, CardContent } from "../ui/card";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function TopicsSidebarContent({ job }: { job: Awaited<ReturnType<typeof GetJobWithTopicsAndArticlesById>> }) {
  const pathname = usePathname();

  if (!job) {
    return (
      <div className="p-4 text-muted-foreground text-center">
        <p>Job not found.</p>
      </div>
    )
  }

  const progress = job.totalItems > 0 ? Math.round((job.completedItems / job.totalItems) * 100) : 0

  return (
    <div className="flex flex-col">
      <Card className="w-full shadow-md rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold truncate">Job {job.id}</h2>
            <Badge
              variant={'outline'}
              className={cn("flex items-center gap-2 text-md mb-2 rounded-sm", getStatusColor(job.status))}
            >
              {getStatusIcon(job.status)} STATUS: {job.status}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Trigger:</span> {job.trigger}</p>
            <p><span className="font-medium text-foreground">Progress:</span> {job.completedItems}/{job.totalItems} ({progress}%)</p>
          </div>

          {job.error && (
            <ScrollArea className="h-12 rounded-md border p-1 text-xs text-red-600">
              {job.error}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex-1 overflow-y-auto space-y-2">
        {job.topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/job/${job.id}/topic/${topic.id}/preview`}
            className={cn(
              "flex items-center p-2 rounded-sm text-sm font-medium transition-colors",
              pathname.includes(String(topic.id))
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <span className="max-w-full truncate">{topic.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

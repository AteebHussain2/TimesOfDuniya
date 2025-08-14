"use client"

import { GetJobWithTopicsAndArticlesById } from "@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById";
import { usePathname } from "next/navigation";
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

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {job.topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/job/${job.id}/topic/${topic.id}/preview`}
                className={cn(
                  "flex items-center p-2 rounded-md text-sm font-medium transition-colors",
                  pathname.includes(String(topic.id))
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <span className="max-w-full truncate">{topic.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

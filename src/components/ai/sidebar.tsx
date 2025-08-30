"use client";

import { LayoutDashboard, FileText, Lightbulb, Clock, Users, Loader2, ClockAlert, Menu } from "lucide-react";
import { GetAllManualQueueJobs } from "@/actions/dashboard/jobs/getAllManualQueueJobs";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DialogTitle } from "../ui/dialog";
import { STATUS } from "@prisma/client";
import Link from "next/link";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/ai",
    icon: LayoutDashboard,
  },
  {
    title: "Topics",
    href: "/ai/topics",
    icon: Lightbulb,
  },
  {
    title: "Articles",
    href: "/ai/articles",
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const { data: queueJobs } = useQuery({
    queryFn: GetAllManualQueueJobs,
    queryKey: ['manual-all-queue-jobs'],
    refetchInterval: 5 * 1000
  })

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="px-3 py-2 border-t">
          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Job Queue
          </div>

          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Total Queue</div>
                <Users className="h-3 w-3 text-muted-foreground" />
              </div>
              {queueJobs ? (
                <div className="text-xl font-bold text-primary">{queueJobs.length}</div>
              ) : (
                <Loader2 className="h-5 w-5 mb-2 animate-spin opacity-50" />
              )}
              <div className="text-xs text-muted-foreground">jobs in queue</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Your Jobs</div>
              {(queueJobs && queueJobs?.length > 0) ? queueJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{job.type}</span>
                  <Badge
                    variant={
                      job.status === STATUS.COMPLETED ? "default" : job.status === STATUS.PROCESSING ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {job.status}
                  </Badge>
                </div>
              )) : queueJobs?.length === 0 ? (
                <div className="flex items-center gap-2 p-3 text-sm text-center text-muted-foreground">
                  <ClockAlert className="h-4 w-4 opacity-50" />
                  <p>No jobs in queue yet!</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 text-sm text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin opacity-50" />
                  <p>Loading jobs...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export function MobileAISidebar() {
  const pathname = usePathname()

  const { data: queueJobs } = useQuery({
    queryFn: GetAllManualQueueJobs,
    queryKey: ['manual-all-queue-jobs'],
    refetchInterval: 5 * 1000,
  })

  return (
    <Sheet>
      {/* Trigger button */}
      <SheetTrigger asChild>
        <DialogTitle asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </DialogTitle>
      </SheetTrigger>

      {/* Sidebar content */}
      <SheetContent side="left" className="w-64 p-4 bg-background/95 backdrop-blur">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 !text-lg font-bold">
            ITL<span className="text-rose-600 dark:text-rose-500">AA</span>
            <Badge variant="secondary" className="text-xs">
              AI Studio
            </Badge>
          </div>

          {/* Navigation items */}
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>

          {/* Job Queue */}
          <div className="border-t pt-4 space-y-3">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Job Queue
            </div>

            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Total Queue</div>
                <Users className="h-3 w-3 text-muted-foreground" />
              </div>
              {queueJobs ? (
                <div className="text-xl font-bold text-primary">{queueJobs.length}</div>
              ) : (
                <Loader2 className="h-5 w-5 mb-2 animate-spin opacity-50" />
              )}
              <div className="text-xs text-muted-foreground">jobs in queue</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Your Jobs</div>
              {(queueJobs && queueJobs?.length > 0) ? (
                queueJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between text-xs">
                    <span className="truncate">{job.type}</span>
                    <Badge
                      variant={
                        job.status === STATUS.COMPLETED
                          ? "default"
                          : job.status === STATUS.PROCESSING
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {job.status}
                    </Badge>
                  </div>
                ))
              ) : queueJobs?.length === 0 ? (
                <div className="flex items-center gap-2 p-3 text-sm text-center text-muted-foreground">
                  <ClockAlert className="h-4 w-4 opacity-50" />
                  <p>No jobs in queue yet!</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 text-sm text-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin opacity-50" />
                  <p>Loading jobs...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet >
  )
}
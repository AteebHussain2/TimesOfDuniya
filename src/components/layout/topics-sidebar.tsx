"use client"

import { GetJobWithTopicsAndArticlesById } from "@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TopicsSidebarContent } from "./topics-sidebar-content";
import { useLayout } from "@/components/layout/layout-context";
import { useState, useEffect, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopicsSidebar({ job }: { job: Awaited<ReturnType<typeof GetJobWithTopicsAndArticlesById>> }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { registerMobileSidebarToggle, unregisterMobileSidebarToggle } = useLayout()

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    registerMobileSidebarToggle(toggleSidebar)
    return () => unregisterMobileSidebarToggle()
  }, [registerMobileSidebarToggle, unregisterMobileSidebarToggle, toggleSidebar])

  const SidebarContent = ({ mobile = false, job }: { mobile?: boolean, job: Awaited<ReturnType<typeof GetJobWithTopicsAndArticlesById>> }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center h-16 px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">Topics</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <TopicsSidebarContent job={job} />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">
        <SidebarContent job={job} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* This SheetTrigger is a dummy, the actual button is in SharedTopbar */}
        <SheetTrigger asChild>
          <div className="hidden"></div>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent job={job} mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}

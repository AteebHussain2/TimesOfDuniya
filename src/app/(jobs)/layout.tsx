import { SharedTopbar } from "@/components/layout/shared-topbar";
import { JobsSidebar } from "@/components/layout/jobs-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type React from "react";
import Link from "next/link";

export default function JobsGroupedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <JobsSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SharedTopbar
          title="Job Monitoring"
          leftContent={
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          }
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

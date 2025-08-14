"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3, ListTodo, CheckCircle, XCircle, Clock } from "lucide-react";
import { useLayout } from "@/components/layout/layout-context";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

export function JobsSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { registerMobileSidebarToggle, unregisterMobileSidebarToggle } = useLayout()

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    registerMobileSidebarToggle(toggleSidebar)
    return () => unregisterMobileSidebarToggle()
  }, [registerMobileSidebarToggle, unregisterMobileSidebarToggle, toggleSidebar])

  const cron = [
    {
      name: "Pending Jobs",
      href: "/cron/jobs",
      icon: ListTodo,
      class:
        "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20",
      active: "text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-400 font-semibold",
    },
    {
      name: "Queued Jobs",
      href: "/cron/jobs/queued",
      icon: Clock,
      class:
        "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20",
      active: "text-blue-600 dark:text-blue-400 ring-2 ring-blue-400 font-semibold",
    },
    {
      name: "Successful Jobs",
      href: "/cron/jobs/successful",
      icon: CheckCircle,
      class:
        "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20",
      active: "text-green-600 dark:text-green-400 ring-2 ring-green-400 font-semibold",
    },
    {
      name: "Failed Jobs",
      href: "/cron/jobs/failed",
      icon: XCircle,
      class:
        "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/20",
      active: "text-red-600 dark:text-red-400 ring-2 ring-red-400 font-semibold",
    },
  ];

  const manual = [
    {
      name: "Pending Jobs",
      href: "/manual/jobs",
      icon: ListTodo,
      class:
        "text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-900/20",
      active: "text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-400 font-semibold",
    },
    {
      name: "Queued Jobs",
      href: "/manual/jobs/queued",
      icon: Clock,
      class:
        "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20",
      active: "text-blue-600 dark:text-blue-400 ring-2 ring-blue-400 font-semibold",
    },
    {
      name: "Successful Jobs",
      href: "/manual/jobs/successful",
      icon: CheckCircle,
      class:
        "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20",
      active: "text-green-600 dark:text-green-400 ring-2 ring-green-400 font-semibold",
    },
    {
      name: "Failed Jobs",
      href: "/manual/jobs/failed",
      icon: XCircle,
      class:
        "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/20",
      active: "text-red-600 dark:text-red-400 ring-2 ring-red-400 font-semibold",
    },
  ];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center h-16 px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-rose-400 dark:bg-rose-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold">Job Categories</span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">Cron</h1>
        {cron.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex gap-4 py-3 items-center px-3 text-sm font-medium rounded-sm transition-colors",
                isActive ? item.active : item.class,
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              {React.createElement(item.icon, { className: "w-5 h-5" })}
              {item.name}
            </Link>
          )
        })}
        <h1 className="text-2xl font-bold flex items-center gap-2">Manual</h1>
        {manual.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex gap-4 py-3 items-center px-3 text-sm font-medium rounded-sm transition-colors",
                isActive ? item.active : item.class,
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              {React.createElement(item.icon, { className: "w-5 h-5" })}
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* This SheetTrigger is a dummy, the actual button is in SharedTopbar */}
        <SheetTrigger asChild>
          <DialogTitle asChild>
            <div className="hidden"></div>
          </DialogTitle>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}

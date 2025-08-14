"use client"

import { useLayout } from "@/components/layout/layout-context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { CloudUpload, Menu, Sparkles } from "lucide-react";
import type React from "react";

interface SharedTopbarProps {
  title: string
  leftContent?: React.ReactNode
  rightContent?: boolean
}

export function SharedTopbar({ title, leftContent, rightContent }: SharedTopbarProps) {
  const { toggleMobileSidebar } = useLayout()

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Trigger */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        {leftContent}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {rightContent && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-[32px] !rounded-sm flex items-center gap-2 border !border-green-400 text-green-400"
            >
              <Sparkles size={24} />
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-[32px] !rounded-sm flex items-center gap-2 border !border-green-400 text-green-400"
              onClick={() => alert('Clicked!')}
            >
              <CloudUpload size={24} />
              Publish
            </Button>
          </>
        )}
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  )
}

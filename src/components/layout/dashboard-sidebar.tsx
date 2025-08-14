"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, ListTodo, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useLayout } from "@/components/layout/layout-context" // Import useLayout

export function DashboardSidebar() {
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

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/jobs", icon: ListTodo },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const navLinkStyle = (isActive: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent",
    )

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "w-full" : "w-64")}>
      <div className="flex items-center h-16 px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">AI Studio</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={navLinkStyle(isActive)}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
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
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-card">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* This SheetTrigger is a dummy, the actual button is in SharedTopbar */}
        <SheetTrigger asChild>
          <div className="hidden"></div>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}

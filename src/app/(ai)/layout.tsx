import type React from "react"
import { Sidebar } from "@/components/ai/sidebar"
import { Topbar } from "@/components/ai/topbar"

export default function AILayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Topbar />

            <div className="flex flex-1">
                <aside className="hidden lg:flex w-64 shrink-0 border-r bg-card sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
                    <Sidebar />
                </aside>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

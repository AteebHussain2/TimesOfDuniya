import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import BreadcrumbHeader from "@/components/BreadcrumHeader";
import CreatePost from "@/components/posts/CreatePost";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DesktopSidebar } from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { UserRoles } from "@/lib/users/userRole";
import { getRole } from "@/lib/users/getRole";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Times Of Duniya",
    description: "Welcome to the Times Of Duniya Admin Dashboard",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const role = await getRole();
    if (role === UserRoles.MEMBER) {
        return (
            <UnauthorizedAccess role={role} />
        );
    };

    return (
        <div className="flex flex-col flex-1 max-h-screen bg-background">
            <header className="flex items-center justify-between bg-background px-6 py-4 h-[60px]">
                <BreadcrumbHeader />
                <div className="flex items-center gap-3">
                    <CreatePost />
                    <ThemeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>

            <Separator />

            <div className="flex h-[calc(100vh-60px)] max-w-screen">
                <DesktopSidebar />
                <div className="overflow-auto">
                    <div className="flex-1 max-w-screen md:max-w-[calc(100vw-280px)] container py-4 text-accent-foreground">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
'use client'

import { ArchiveIcon, ChartColumnIcon, GalleryHorizontalIcon, LibrarySquareIcon, LucideLayoutDashboard, MenuIcon, MessageSquareMoreIcon, UsersRoundIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import UserProfile from "./users/UserProfile";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "./Logo";

const routes = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: LucideLayoutDashboard,
    },
    {
        href: "/content",
        label: "Content",
        icon: GalleryHorizontalIcon,
    },
    {
        href: "/categories",
        label: "Categories",
        icon: LibrarySquareIcon,
    },
    {
        href: "/analytics",
        label: "Analytics",
        icon: ChartColumnIcon,
    },
    {
        href: "/comments",
        label: "Community",
        icon: MessageSquareMoreIcon,
    },
    {
        href: "/users",
        label: "User Management",
        icon: UsersRoundIcon,
    },
    {
        href: "/archived",
        label: "Archived Posts",
        icon: ArchiveIcon,
    },
];

const DesktopSidebar = () => {
    const path = usePathname()
    const activeRoute = routes.find(
        (route) => route.href.length > 0 && path.includes(route.href)
    ) || routes[0];

    return (
        <div className="hidden md:block relative min-w-[280px] max-w-[280px] h-full overflow-hidden w-full bg-background text-foreground border-r-2 border-separate">
            <UserProfile />

            <Separator />

            <div className="flex flex-col p-2">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href === '' ? '/' : route.href}
                        className={cn("flex justify-center !gap-4 !py-3 !h-full",
                            buttonVariants({
                                variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem",
                            })
                        )}
                    >
                        <route.icon size={20} className={cn('size-[20px]', activeRoute.href === route.href ? 'fill-foregroundfff text-foreground' : 'fill-transparent text-foreground')} />
                        <span className="font-semibold">{route.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export { DesktopSidebar }

const MobileSidebar = () => {
    const [isOpen, setOpen] = useState(false);
    const pathName = usePathname()
    const activeRoute = routes.find(
        (route) => route.href.length > 0 && pathName.includes(route.href)
    ) || routes[0];

    return (
        <div className="border-separate bg-background md:hidden">
            <nav className="container flex items-center justify-between">
                <Sheet open={isOpen} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <DialogTitle asChild>
                            <Button variant={"ghost"} size={"icon"}>
                                <MenuIcon />
                            </Button>
                        </DialogTitle>
                    </SheetTrigger>
                    <SheetContent
                        className="w-full max-w-[400px] sm:w-[540px] p-4"
                        side={"left"}
                    >

                        <Logo title="Studio" fontSize="text-2xl font-bold" />
                        <Separator />

                        <UserProfile />
                        <Separator />

                        <div className="flex flex-col gap-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href === '' ? '/' : route.href}
                                    className={cn("flex justify-center !gap-4",
                                        buttonVariants({
                                            variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem",
                                        })
                                    )}
                                    onClick={() => setOpen(false)}
                                >
                                    <route.icon size={20} className={cn('size-[20px]', activeRoute.href === route.href ? 'fill-primary' : 'fill-transparent')} />
                                    <span className="font-semibold">{route.label}</span>
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

export { MobileSidebar }
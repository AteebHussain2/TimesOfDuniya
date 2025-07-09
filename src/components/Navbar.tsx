"use client"

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type React from "react";
import Link from "next/link";
import Logo from "./Logo";

const categories = ["International", "Pakistan", "Politics", "Business", "Technology", "Sports", "Health", "Entertainment", "Anime", "Dashboard"]

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const isActiveCategory = (category: string) => {
        return pathname === `/category/${category.toLowerCase()}`
    }

    return (
        <nav className="sticky top-0 z-50 md:relative bg-background border-b border-separate shadow-sm">
            {/* Top Bar */}
            <div className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo with Menu */}
                        <div className="flex items-center space-x-3">
                            <MobileMenu
                                isOpen={isMobileMenuOpen}
                                setOpen={setIsMobileMenuOpen}
                                isActive={isActiveCategory}
                                handleSearch={handleSearch}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />

                            <Logo />
                        </div>

                        {/* Right Side - Search, Theme Toggle and User */}
                        <div className="flex items-center space-x-2">
                            {/* Desktop Search */}
                            <form onSubmit={handleSearch} className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search news..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-48 lg:w-64"
                                />
                            </form>

                            <ThemeToggle />

                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <SignInButton>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center space-x-2"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="hidden sm:block">Sign In</span>
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Bar - Desktop */}
            <div className="hidden md:block sticky top-0 z-50 bg-background/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center space-x-1 overflow-x-auto hide-scrollbar">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                href={`/category/${category.toLowerCase()}`}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap hover:bg-rose-100 hover:text-rose-700 hover:dark:bg-rose-900/20 hover:dark:text-rose-400",
                                    isActiveCategory(category)
                                        ? "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                                        : "text-muted-foreground",
                                )}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}

const MobileMenu = ({
    isOpen,
    setOpen,
    isActive,
    handleSearch,
    searchQuery,
    setSearchQuery,
}: {
    isOpen: boolean,
    setOpen: (value: boolean) => void,
    isActive: (category: string) => boolean,
    handleSearch: (e: React.FormEvent) => void,
    searchQuery: string,
    setSearchQuery: (value: string) => void,
}) => {
    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 py-4">
                    <div className="px-3 py-2">
                        <h2 className="mb-4 px-4 text-lg font-semibold tracking-tight">Categories</h2>
                        <div className="space-y-1">
                            {categories.map((category) => (
                                <Link
                                    key={category}
                                    href={`/category/${category.toLowerCase()}`}
                                    className={cn(
                                        "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                        isActive(category)
                                            ? "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                    )}
                                    onClick={() => setOpen(false)}
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="px-3 py-2">
                        <h3 className="mb-2 px-4 text-sm font-semibold">Search</h3>
                        <form onSubmit={handleSearch} className="px-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search news..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
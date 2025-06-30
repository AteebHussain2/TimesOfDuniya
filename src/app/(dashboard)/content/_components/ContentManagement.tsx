"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypeGetAllPosts, TypeGetCategories } from "@/lib/types";
import { Search, Filter, Grid, List, Plus } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import PostFilters from "./PostFilters";
import PostCard from "./PostCard";
import { cn } from "@/lib/utils";

interface Props {
    initialPosts: TypeGetAllPosts
    categories: TypeGetCategories
    initialParams: {
        category?: string
        status?: string
        author?: string
        search?: string
    }
}

type ViewMode = "grid" | "list"
type SortOption = "newest" | "oldest" | "title" | "views" | "author"

const ContentManagement = ({ initialPosts, categories, initialParams }: Props) => {
    const searchParams = useSearchParams()

    // State management
    const [selectedCategory, setSelectedCategory] = useState(initialParams.category || "all");
    const [selectedStatus, setSelectedStatus] = useState(initialParams.status || "all");
    const [selectedAuthor, setSelectedAuthor] = useState(initialParams.author || "all");
    const [searchQuery, setSearchQuery] = useState(initialParams.search || "");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [posts] = useState<TypeGetAllPosts>(initialPosts);
    const [showFilters, setShowFilters] = useState(false);

    // Get unique authors for filtering
    const authors = useMemo(() => {
        const uniqueAuthors = Array.from(new Set(posts.map((post) => post.author.username)))
        return uniqueAuthors
            .map((username) => {
                const author = posts.find((post) => post.author.username === username)?.author
                return author
            })
            .filter(Boolean)
    }, [posts]);

    // Filter and sort posts
    const filteredAndSortedPosts = useMemo(() => {
        const filtered = posts.filter((post) => {
            const matchesSearch =
                searchQuery === "" ||
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.author.username.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = selectedCategory === "all" || post.category?.slug === selectedCategory

            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "published" && post.published) ||
                (selectedStatus === "draft" && !post.published)

            const matchesAuthor = selectedAuthor === "all" || post.author.username === selectedAuthor

            return matchesSearch && matchesCategory && matchesStatus && matchesAuthor
        })

        // Sort posts
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
                case "oldest":
                    return new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime()
                case "title":
                    return a.title.localeCompare(b.title)
                case "views":
                    return (b.views.length || 0) - (a.views.length || 0)
                case "author":
                    return a.author.username.localeCompare(b.author.username)
                default:
                    return 0
            }
        })

        return filtered
    }, [posts, searchQuery, selectedCategory, selectedStatus, selectedAuthor, sortBy])

    // Update URL without causing server request
    const updateURL = useCallback(
        (params: Record<string, string>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            Object.entries(params).forEach(([key, value]) => {
                if (value && value !== "all" && value !== "") {
                    newSearchParams.set(key, value)
                } else {
                    newSearchParams.delete(key)
                }
            })

            const newURL = `${window.location.pathname}?${newSearchParams.toString()}`
            window.history.replaceState({}, "", newURL)
        },
        [searchParams],
    )

    // Handle filter changes
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        updateURL({ category, status: selectedStatus, author: selectedAuthor, search: searchQuery })
    }

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status)
        updateURL({ category: selectedCategory, status, author: selectedAuthor, search: searchQuery })
    }

    const handleAuthorChange = (author: string) => {
        setSelectedAuthor(author)
        updateURL({ category: selectedCategory, status: selectedStatus, author, search: searchQuery })
    }

    const handleSearchChange = (search: string) => {
        setSearchQuery(search)
        updateURL({ category: selectedCategory, status: selectedStatus, author: selectedAuthor, search })
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("all")
        setSelectedStatus("all")
        setSelectedAuthor("all")
        updateURL({})
    }

    const activeFiltersCount = [
        selectedCategory !== "all",
        selectedStatus !== "all",
        selectedAuthor !== "all",
        searchQuery !== "",
    ].filter(Boolean).length

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Search and Controls */}
            <div className="w-full px-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search posts, content, or authors..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="relative">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>

                        <div className="flex items-center border rounded-md">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="rounded-r-none"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Button asChild>
                        <a href="/content/create">
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                        </a>
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <PostFilters
                    categories={categories}
                    authors={authors}
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    selectedAuthor={selectedAuthor}
                    sortBy={sortBy}
                    onCategoryChange={handleCategoryChange}
                    onStatusChange={handleStatusChange}
                    onAuthorChange={handleAuthorChange}
                    onSortChange={(sort: string) => setSortBy(sort as SortOption)}
                    onClearFilters={clearFilters}
                />
            )}

            <Separator />

            {/* Results Summary */}
            <div className="px-6 flex sm:flex-row flex-col-reverse items-start sm:items-center gap-4 sm:gap-0 justify-between">
                <div className="flex sm:flex-row flex-col-reverse items-start sm:items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        {filteredAndSortedPosts.length} of {posts.length} posts
                    </p>

                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filters:</span>
                            {selectedCategory !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Category: {categories.find((c) => c.slug === selectedCategory)?.name}
                                </Badge>
                            )}
                            {selectedStatus !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Status: {selectedStatus}
                                </Badge>
                            )}
                            {selectedAuthor !== "all" && (
                                <Badge variant="secondary" className="text-xs">
                                    Author: {selectedAuthor}
                                </Badge>
                            )}
                            {searchQuery && (
                                <Badge variant="secondary" className="text-xs">
                                    Search: &ldquo;{searchQuery}&rdquo;
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                        <SelectItem value="views">Most Views</SelectItem>
                        <SelectItem value="author">Author A-Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Posts Grid/List */}
            <div className="w-full px-2 sm:px-6">
                {filteredAndSortedPosts.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                            <p className="text-muted-foreground mb-4">
                                {activeFiltersCount > 0
                                    ? "Try adjusting your filters or search terms"
                                    : "Create your first post to get started"}
                            </p>
                            {activeFiltersCount > 0 ? (
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            ) : (
                                <Button asChild>
                                    <a href="/content/create">Create Post</a>
                                </Button>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div
                        className={cn(
                            "grid gap-4",
                            viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                        )}
                    >
                        {filteredAndSortedPosts.map((post) => (
                            <PostCard key={post.id} post={post} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContentManagement;
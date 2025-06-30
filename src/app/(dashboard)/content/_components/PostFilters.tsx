"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { TypeGetCategories } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { X } from "lucide-react";

interface Props {
  categories: TypeGetCategories;
  authors: (User | undefined)[]
  selectedCategory: string
  selectedStatus: string
  selectedAuthor: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onStatusChange: (status: string) => void
  onAuthorChange: (author: string) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
}

const PostFilters = ({
  categories,
  authors,
  selectedCategory,
  selectedStatus,
  selectedAuthor,
  sortBy,
  onCategoryChange,
  onStatusChange,
  onAuthorChange,
  onSortChange,
  onClearFilters,
}: Props) => {
  return (
    <Card className="mx-6 !p-0">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
            {/* Category Filter */}
            <div className="w-full space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Author Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Select value={selectedAuthor} onValueChange={onAuthorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Authors</SelectItem>
                  {authors.filter(Boolean).map((author) => (
                    <SelectItem key={author!.username} value={author!.username}>
                      {author!.firstName && author!.lastName
                        ? `${author!.firstName} ${author!.lastName}`
                        : `@${author!.username}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full">
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
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="shrink-0 sm:w-fit w-full flex items-center gap-1 !border-destructive !text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostFilters

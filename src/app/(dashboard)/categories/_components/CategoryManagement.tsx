"use client"

import { Grid3X3, List, FolderOpen, FileText, Calendar, TrendingUp } from "lucide-react";
import CategoryStatsCard from "@/components/category/CategoryStatsCard";
import { useDataFiltering } from "@/hooks/use-data-filtering";
import DataFilters from "@/components/shared/DataFilters";
import { TypeGetCategoriesWithPosts } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AllCategories from "./AllCategories";
import { useState, useMemo } from "react";

const CategoryManagement = ({ categories }: { categories: TypeGetCategoriesWithPosts }) => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const filterConfig = {
    searchFields: ["name", "slug", "description"],
    filterFields: {
      status: {
        options: [
          { label: "All Status", value: "all" },
          { label: "Active (Has Posts)", value: "active" },
          { label: "Empty (No Posts)", value: "empty" },
        ],
      },
    },
    sortOptions: [
      { label: "Recently Updated", value: "updated" },
      { label: "Oldest First", value: "oldest" },
      { label: "Name (A-Z)", value: "name" },
      { label: "Most Posts", value: "posts" },
    ],
    defaultSort: "updated",
  }

  const {
    filteredData,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    sortBy,
    setSortBy,
    activeFilterCount,
    filteredCount,
    totalCount,
    isEmpty,
  } = useDataFiltering(categories, filterConfig)

  const stats = useMemo(() => {
    const total = categories.length
    const active = categories.filter((cat) => cat.posts.length > 0).length
    const empty = total - active
    const totalPosts = categories.reduce((sum, cat) => sum + cat.posts.length, 0)

    return { total, active, empty, totalPosts }
  }, [categories])

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
        <CategoryStatsCard
          title="Total Categories"
          value={stats.total}
          icon={FolderOpen}
        />

        <CategoryStatsCard
          title="Total Active"
          value={stats.active}
          icon={TrendingUp}
          iconClass="text-green-600"
        />

        <CategoryStatsCard
          title="Total Empty"
          value={stats.empty}
          icon={Calendar}
          iconClass="text-orange-600"
        />

        <CategoryStatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          iconClass="text-blue-600"
        />
      </div>

      {/* Filters */}
      <div className="px-6">
        <DataFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          updateFilter={updateFilter}
          clearFilter={clearFilter}
          clearAllFilters={clearAllFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode="grid" // Categories use table/grid, but DataFilters expects grid/list
          setViewMode={() => { }} // Not used for categories
          activeFilterCount={activeFilterCount}
          filteredCount={filteredCount}
          totalCount={totalCount}
          config={filterConfig}
          searchPlaceholder="Search categories by name, slug, or description..."
        />
      </div>

      {/* View Controls & Results */}
      <div className="px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredCount} of {totalCount} categories
            </span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 px-2"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {isEmpty ? (
        <div className="px-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters"
                  : "Create your first category to get started"}
              </p>
              {(searchQuery || activeFilterCount > 0) && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <AllCategories categories={filteredData} viewMode={viewMode} />
      )}
    </div>
  )
}

export default CategoryManagement

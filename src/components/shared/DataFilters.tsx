"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Search, X, Grid3X3, List, SlidersHorizontal } from "lucide-react"
import type { FilterConfig } from "@/hooks/use-data-filtering"

interface Props {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: Record<string, string | string[]>
  updateFilter: (key: string, value: string | string[]) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  activeFilterCount: number
  filteredCount: number
  totalCount: number
  config: FilterConfig
  searchPlaceholder?: string
}

const DataFilters = ({
  searchQuery,
  setSearchQuery,
  filters,
  updateFilter,
  clearFilter,
  clearAllFilters,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  activeFilterCount,
  filteredCount,
  totalCount,
  config,
  searchPlaceholder = "Search...",
}: Props) => {
  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
            className="border rounded-lg p-1"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view" size="sm">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {Object.entries(config.filterFields).map(([key, fieldConfig]) => (
            <Select
              key={key}
              value={(filters[key] as string) || "all"}
              onValueChange={(value) => updateFilter(key, value)}
            >
              <SelectTrigger className="w-auto min-w-[120px] h-8">
                <SelectValue placeholder={`Select ${key}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldConfig.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <Select value={sortBy || config.sortOptions[0]?.value || "newest"} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto min-w-[140px] h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {config.sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters} className="h-8 px-2 text-xs"
            >
              Clear all
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} results
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: &ldquo;{searchQuery}&rdquo;
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0) || value === "all") return null

            const displayValue = Array.isArray(value) ? value.join(", ") : value
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {key}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => clearFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DataFilters
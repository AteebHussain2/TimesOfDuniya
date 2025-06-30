"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export interface FilterConfig {
  searchFields: string[]
  filterFields: {
    [key: string]: {
      options: { label: string; value: string }[]
      multiple?: boolean
    }
  }
  sortOptions: { label: string; value: string }[]
  defaultSort?: string
}

export function useDataFiltering<T extends Record<string, any>>(data: T[], config: FilterConfig) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || config.defaultSort || config.sortOptions[0]?.value || "",
  )
  const [viewMode, setViewMode] = useState<"grid" | "list">((searchParams.get("view") as "grid" | "list") || "grid")

  // Initialize filters from URL params
  const [filters, setFilters] = useState<Record<string, string | string[]>>(() => {
    const initialFilters: Record<string, string | string[]> = {}
    Object.keys(config.filterFields).forEach((key) => {
      const paramValue = searchParams.get(key)
      if (paramValue) {
        initialFilters[key] = config.filterFields[key].multiple ? paramValue.split(",") : paramValue
      }
    })
    return initialFilters
  })

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sort", sortBy)
    if (viewMode !== "grid") params.set("view", viewMode)

    Object.entries(filters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value)) {
        params.set(key, Array.isArray(value) ? value.join(",") : value)
      }
    })

    // Preserve the current pathname
    const currentPath = window.location.pathname
    const newURL = params.toString() ? `${currentPath}?${params.toString()}` : currentPath
    router.replace(newURL, { scroll: false })
  }, [searchQuery, sortBy, viewMode, filters, router])

  useEffect(() => {
    const timeoutId = setTimeout(updateURL, 300) // Debounce URL updates
    return () => clearTimeout(timeoutId)
  }, [updateURL])

  // Helper – safe access to nested values (placed BEFORE first use)
  function getNestedValue(obj: any, path: string) {
    return path.split(".").reduce((current: any, key: string) => (current ? current[key] : undefined), obj)
  }

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((item) =>
        config.searchFields.some((field) => {
          const value = getNestedValue(item, field)
          return value && value.toString().toLowerCase().includes(query)
        }),
      )
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value) && value !== "all") {
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key)
          if (Array.isArray(value)) {
            return value.includes(itemValue?.toString())
          }

          // Handle special filter cases
          if (key === "isActive") {
            return value === "true" ? item.isActive === true : item.isActive === false
          }
          if (key === "status" && value === "active") {
            return item.posts && item.posts.length > 0
          }
          if (key === "status" && value === "empty") {
            return !item.posts || item.posts.length === 0
          }

          return itemValue?.toString() === value
        })
      }
    })

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime()
          case "oldest":
            return new Date(a.createdAt || a.updatedAt).getTime() - new Date(b.createdAt || b.updatedAt).getTime()
          case "name":
            return (a.name || a.title || a.firstName || "").localeCompare(b.name || b.title || b.firstName || "")
          case "email":
            return (a.email || "").localeCompare(b.email || "")
          case "role":
            return (a.role || "").localeCompare(b.role || "")
          case "posts":
            return (b._count?.posts || b.posts?.length || 0) - (a._count?.posts || a.posts?.length || 0)
          case "updated":
          case "recently-updated":
            return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
          default:
            return 0
        }
      })
    }

    return result
  }, [data, searchQuery, filters, sortBy, config.searchFields])

  // Filter management functions
  const updateFilter = useCallback((key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({})
    setSearchQuery("")
  }, [])

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    Object.values(filters).forEach((value) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value) && value !== "all") count++
    })
    return count
  }, [searchQuery, filters])

  return {
    // Data
    filteredData,
    totalCount: data.length,
    filteredCount: filteredData.length,

    // Search
    searchQuery,
    setSearchQuery,

    // Filters
    filters,
    updateFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,

    // Sorting
    sortBy,
    setSortBy,

    // View
    viewMode,
    setViewMode,

    // Utilities
    hasActiveFilters: activeFilterCount > 0,
    isEmpty: filteredData.length === 0,
    isFiltered: activeFilterCount > 0 || data.length !== filteredData.length,
  }
}

// Default export for backward compatibility
export default useDataFiltering

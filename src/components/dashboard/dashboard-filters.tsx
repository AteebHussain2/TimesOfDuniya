"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyticsFilter } from "@/lib/types/dashboard";
import { CalendarIcon, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

interface DashboardFiltersProps {
  filters: AnalyticsFilter
  onFiltersChange: (filters: AnalyticsFilter) => void
  onExport: (format: "csv" | "pdf") => void
  showExport?: boolean
}

export function DashboardFilters({ filters, onFiltersChange, onExport, showExport = true }: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState<Date | undefined>()

  const handleDateRangeChange = (range: "7d" | "30d" | "90d" | "custom") => {
    onFiltersChange({ ...filters, dateRange: range })
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category === "all" ? undefined : category })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Export</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Politics">Politics</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.dateRange === "custom" && (
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Custom Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange ? format(dateRange, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {showExport && (
            <div className="flex gap-2 items-end">
              <Button variant="outline" onClick={() => onExport("csv")}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => onExport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

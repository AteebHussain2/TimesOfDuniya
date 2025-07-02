"use client"

import { useDataFiltering } from "@/hooks/use-data-filtering";
import DataFilters from "@/components/shared/DataFilters";
import { Separator } from "@/components/ui/separator";
import { TypeGetAllUsersData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import UserCard from "./UserCard";

const UserManagement = ({ users }: { users: TypeGetAllUsersData }) => {
  const filterConfig = {
    searchFields: ["firstName", "lastName", "username", "email"],
    filterFields: {
      role: {
        options: [
          { label: "All Roles", value: "all" },
          { label: "Admin", value: "ADMIN" },
          { label: "Moderator", value: "MODERATOR" },
          { label: "User", value: "USER" },
        ],
      },
      isActive: {
        options: [
          { label: "All Status", value: "all" },
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
    },
    sortOptions: [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Name A-Z", value: "name" },
      { label: "Email A-Z", value: "email" },
      { label: "Role", value: "role" },
    ],
    defaultSort: "newest",
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
    viewMode,
    setViewMode,
    activeFilterCount,
    filteredCount,
    totalCount,
    isEmpty,
  } = useDataFiltering(users, filterConfig)

  return (
    <div className="w-full space-y-6">
      <Separator />

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
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeFilterCount={activeFilterCount}
          filteredCount={filteredCount}
          totalCount={totalCount}
          config={filterConfig}
          searchPlaceholder="Search users by name, username, or email..."
        />
      </div>

      <Separator />

      <div className="px-2 sm:px-8">
        {isEmpty ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {activeFilterCount > 0 ? "No users match your filters" : "No users found"}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant={"outline"}
                onClick={clearAllFilters}
                className="text-primary hover:underline mt-2"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredData.map((user) => (
              <UserCard key={user.id} user={user} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement

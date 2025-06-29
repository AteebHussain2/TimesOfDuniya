"use client";

import { GetPostsBySearchQuery } from "@/actions/site/posts/getPostsBySearchQuery";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/posts/PostCard";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const { data: results = [] } = useQuery({
    queryKey: ["search-posts", query],
    queryFn: () => GetPostsBySearchQuery(query),
    enabled: !!query.trim(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // performSearch(query)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-6">Search</h1>

          <form
            onSubmit={handleSearch}
            className="max-w-2xl"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for news articles..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="w-full pl-12 pr-4 pt-2 pb-[10px] border-2 border-separate rounded-md outline-none"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
          </form>
        </div>

        <Separator className="my-4" />

        {/* Search Results */}
        {query && results ? (
          <div>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} found for &ldquo;{query}&rdquo;
              </p>
            </div>

            {results.length > 0 ? (
              <div className="flex flex-wrap gap-6">
                {results.map((post) => (
                  <PostCard key={post.id} post={post} showViews showLikes showCategory />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-primary text-lg">No articles found matching your search.</p>
                <p className="text-muted-foreground mt-2">Try different keywords or browse our categories.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Enter a search term to find articles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

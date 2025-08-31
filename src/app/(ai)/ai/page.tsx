"use client";

import { GeneratedTopicsSection } from "@/components/ai/generated-topics-section";
import { TopicGenerationForm } from "@/components/ai/topic-generation-form";
import { GetCategories } from "@/actions/site/categories/getCategories";
import { ArticlesSection } from "@/components/ai/articles-section";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Category } from "@prisma/client";


export default function AIDashboardPage() {
  const articlesRef = useRef<HTMLDivElement | null>(null)

  const scrollToArticles = () => {
    articlesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fallbackCategories: Category[] = [
    { "id": 21, "name": "Blog", "slug": "blog", "description": "A collection of articles, opinions, and stories.", "createdAt": new Date("2025-07-26T16:36:08.215Z"), "updatedAt": new Date("2025-07-26T16:36:08.215Z") },
    { "id": 20, "name": "Anime", "slug": "anime", "description": "News, reviews, and discussions on Japanese animation.", "createdAt": new Date("2025-07-26T16:35:44.560Z"), "updatedAt": new Date("2025-07-26T16:35:44.560Z") },
    { "id": 19, "name": "Entertainment", "slug": "entertainment", "description": "Updates from the world of movies, music, and celebrity.", "createdAt": new Date("2025-07-26T16:35:28.625Z"), "updatedAt": new Date("2025-07-26T16:35:28.625Z") },
    { "id": 18, "name": "Health", "slug": "health", "description": "Information and news related to well-being and medicine.", "createdAt": new Date("2025-07-26T16:35:13.537Z"), "updatedAt": new Date("2025-07-26T16:35:13.537Z") },
    { "id": 17, "name": "Sports", "slug": "sports", "description": "Coverage of various sports, matches, and athletes.", "createdAt": new Date("2025-07-26T16:34:58.323Z"), "updatedAt": new Date("2025-07-26T16:34:58.323Z") },
    { "id": 16, "name": "Technology", "slug": "technology", "description": "Innovations, trends, and news from the tech industry.", "createdAt": new Date("2025-07-26T16:34:45.195Z"), "updatedAt": new Date("2025-07-26T16:34:45.195Z") },
    { "id": 15, "name": "Business", "slug": "business", "description": "Insights and news from the world of commerce and finance.", "createdAt": new Date("2025-07-26T16:34:26.523Z"), "updatedAt": new Date("2025-07-26T16:34:26.523Z") },
    { "id": 14, "name": "Politics", "slug": "politics", "description": "Updates and analysis on political affairs.", "createdAt": new Date("2025-07-26T16:34:10.555Z"), "updatedAt": new Date("2025-07-26T16:34:10.555Z") },
    { "id": 13, "name": "Pakistan", "slug": "pakistan", "description": "Latest happenings and news within Pakistan.", "createdAt": new Date("2025-07-26T16:33:56.547Z"), "updatedAt": new Date("2025-07-26T16:33:56.547Z") },
    { "id": 12, "name": "International", "slug": "international", "description": "News and events from around the globe.", "createdAt": new Date("2025-07-26T16:33:42.129Z"), "updatedAt": new Date("2025-07-26T16:33:42.129Z") }
  ]

  const { data: newCategories } = useQuery({
    queryFn: GetCategories,
    queryKey: ['ai-form-categories'],
  })

  const categories = newCategories || fallbackCategories

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Content Studio</h1>
        <p className="text-muted-foreground">Generate topics and create articles with AI assistance</p>
      </div>

      <TopicGenerationForm categories={categories} onGenerate={scrollToArticles} />
      <GeneratedTopicsSection />
      <ArticlesSection />
    </div>
  )
}

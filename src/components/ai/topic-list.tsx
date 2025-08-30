"use client"

import { TopicCard } from "./topic-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Topic {
  id: number
  title: string
  summary: string
  sources: string[]
  publishedDate: string
  hasArticle: boolean
  isGenerating: boolean
}

interface TopicListProps {
  topics: Topic[]
  onArticleSelect: (article: any) => void
  isLoading: boolean
}

export function TopicList({ topics, onArticleSelect, isLoading }: TopicListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generated Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const topicsList = topics || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Topics ({topicsList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topicsList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No topics generated yet.</p>
              <p className="text-sm">Use the form above to generate topics.</p>
            </div>
          ) : (
            topicsList.map((topic) => <TopicCard key={topic.id} topic={topic} onArticleSelect={onArticleSelect} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}

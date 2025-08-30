"use client"

import { useState } from "react"
import { AiGeneratorForm } from "./ai-generator-form"
import { TopicList } from "./topic-list"
import { JobStatusCard } from "./job-status-card"
import { ArticlePreviewPanel } from "./article-preview-panel"
import { useTopics } from "@/hooks/use-topics"

export function AiStudioContent() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const { topics, currentJob, isLoading } = useTopics()

  return (
    <div className="space-y-8">
      <AiGeneratorForm />

      {currentJob && <JobStatusCard job={currentJob} />}

      {topics.length > 0 && <TopicList topics={topics} onArticleSelect={setSelectedArticle} isLoading={isLoading} />}

      {selectedArticle && <ArticlePreviewPanel article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  )
}

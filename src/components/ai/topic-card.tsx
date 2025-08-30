"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAiQuota } from "@/hooks/use-ai-quota"
import { generateArticle } from "@/lib/actions/ai-actions"

interface Topic {
  id: number
  title: string
  summary: string
  sources: string[]
  publishedDate: string
  hasArticle: boolean
  isGenerating: boolean
}

interface TopicCardProps {
  topic: Topic
  onArticleSelect: (article: any) => void
}

export function TopicCard({ topic, onArticleSelect }: TopicCardProps) {
  const [isGenerating, setIsGenerating] = useState(topic.isGenerating)
  const { canGenerate, consumeQuota } = useAiQuota()
  const { toast } = useToast()

  const handleGenerateArticle = async () => {
    if (!canGenerate) {
      toast({
        title: "Quota Exceeded",
        description: "Please sign in to continue generating articles.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const article = await generateArticle({
        title: topic.title,
        summary: topic.summary,
        sources: topic.sources,
        categoryId: 1,
        topicId: topic.id,
        trigger: "MANUAL",
      })

      consumeQuota()
      onArticleSelect(article)

      toast({
        title: "Article Generated",
        description: "Your article has been generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(topic.title)
    toast({
      title: "Copied",
      description: "Title copied to clipboard",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{topic.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{topic.summary}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {topic.sources.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Published: {new Date(topic.publishedDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateArticle}
              disabled={topic.hasArticle || isGenerating || !canGenerate}
              className="flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {topic.hasArticle ? "Article Ready" : "Generate Article"}
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>

            <Button variant="ghost" size="sm" onClick={handleCopyTitle} className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy Title
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

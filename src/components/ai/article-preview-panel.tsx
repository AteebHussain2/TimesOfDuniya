"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Upload, Send, ImageIcon } from "lucide-react"
import { ImageUploader } from "./image-uploader"
import { useToast } from "@/hooks/use-toast"

interface Article {
  id: number
  title: string
  summary: string
  content: string
  tags: string[]
  accuracyScore: number
  thumbnail?: string
  publishedAt?: string
}

interface ArticlePreviewPanelProps {
  article: Article
  onClose: () => void
  onPublish?: (articleId: number, thumbnailUrl?: string) => Promise<void>
}

export function ArticlePreviewPanel({ article, onClose, onPublish }: ArticlePreviewPanelProps) {
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(article.thumbnail)
  const { toast } = useToast()

  const handleImageUpload = (url: string) => {
    setThumbnailUrl(url)
    setShowImageUploader(false)
    toast({
      title: "Image Uploaded",
      description: "Thumbnail image has been attached to the article.",
    })
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      if (onPublish) {
        await onPublish(article.id, thumbnailUrl)
      } else {
        // Default publish simulation
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      toast({
        title: "Article Published",
        description: "Your article has been published successfully!",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Publish Failed",
        description: "Failed to publish article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const AccuracyBadge = () => (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <Progress value={article.accuracyScore} className="w-8 h-8 rounded-full" />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {article.accuracyScore}
        </span>
      </div>
      <span className="text-sm font-medium">Accuracy</span>
    </div>
  )

  return (
    <Card className="fixed inset-4 z-50 overflow-auto bg-background">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle>Article Preview</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{article.summary}</p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <AccuracyBadge />
          </div>
        </div>

        {thumbnailUrl ? (
          <div className="relative group">
            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt="Article thumbnail"
              className="w-full h-64 object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowImageUploader(true)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center bg-muted/20">
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No thumbnail image</p>
            <p className="text-muted-foreground mb-6">Add a compelling image to increase engagement</p>
            <Button onClick={() => setShowImageUploader(true)} className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Thumbnail
            </Button>
          </div>
        )}

        <div className="border rounded-lg p-6 bg-muted/20">
          <h3 className="text-lg font-semibold mb-4">Content Preview</h3>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">
              {article.content.substring(0, 500)}
              {article.content.length > 500 && "..."}
            </div>
          </div>
          {article.content.length > 500 && (
            <p className="text-sm text-muted-foreground mt-4 italic">
              Showing first 500 characters. Full content will be published.
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button variant="outline" onClick={() => setShowImageUploader(true)} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {thumbnailUrl ? "Change Image" : "Add Thumbnail"}
          </Button>

          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 ml-auto px-8"
            size="lg"
          >
            <Send className="w-4 h-4" />
            {isPublishing ? "Publishing..." : "Publish Article"}
          </Button>
        </div>

        {showImageUploader && (
          <ImageUploader onUpload={handleImageUpload} onClose={() => setShowImageUploader(false)} />
        )}
      </CardContent>
    </Card>
  )
}

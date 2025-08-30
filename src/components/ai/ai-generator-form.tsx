"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles } from "lucide-react"
import { useAiQuota } from "@/hooks/use-ai-quota"
import { useToast } from "@/hooks/use-toast"
import { generateTopics } from "@/lib/actions/ai-actions"

export function AiGeneratorForm() {
  const [formData, setFormData] = useState({
    apiKey: "",
    categoryId: "",
    minTopics: 3,
    maxTopics: 10,
    timeDuration: "24 hours",
    excludedTitles: [] as string[],
    trigger: "MANUAL" as const,
  })
  const [excludedInput, setExcludedInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { canGenerate, isSignedIn } = useAiQuota()
  const { toast } = useToast()

  const handleAddExcluded = () => {
    if (excludedInput.trim() && !formData.excludedTitles.includes(excludedInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        excludedTitles: [...prev.excludedTitles, excludedInput.trim()],
      }))
      setExcludedInput("")
    }
  }

  const handleRemoveExcluded = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      excludedTitles: prev.excludedTitles.filter((t) => t !== title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canGenerate) {
      toast({
        title: "Quota Exceeded",
        description: "Please sign in to continue generating content.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await generateTopics(formData)
      toast({
        title: "Topics Generation Started",
        description: "Your topics are being generated. Please wait...",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to start topic generation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Topic Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key (Optional)</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key for demo"
                value={formData.apiKey}
                onChange={(e) => setFormData((prev) => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Technology</SelectItem>
                  <SelectItem value="2">Health</SelectItem>
                  <SelectItem value="3">Business</SelectItem>
                  <SelectItem value="4">Science</SelectItem>
                  <SelectItem value="5">Politics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minTopics">Min Topics</Label>
              <Input
                id="minTopics"
                type="number"
                min="1"
                max="20"
                value={formData.minTopics}
                onChange={(e) => setFormData((prev) => ({ ...prev, minTopics: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTopics">Max Topics</Label>
              <Input
                id="maxTopics"
                type="number"
                min="1"
                max="20"
                value={formData.maxTopics}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxTopics: Number.parseInt(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeDuration">Time Duration</Label>
              <Select
                value={formData.timeDuration}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, timeDuration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24 hours">24 hours</SelectItem>
                  <SelectItem value="7 days">7 days</SelectItem>
                  <SelectItem value="30 days">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excludedTitles">Excluded Titles</Label>
            <div className="flex gap-2">
              <Input
                id="excludedTitles"
                placeholder="Enter title to exclude"
                value={excludedInput}
                onChange={(e) => setExcludedInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddExcluded())}
              />
              <Button type="button" variant="outline" onClick={handleAddExcluded}>
                Add
              </Button>
            </div>
            {formData.excludedTitles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.excludedTitles.map((title) => (
                  <Badge key={title} variant="secondary" className="flex items-center gap-1">
                    {title}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveExcluded(title)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !canGenerate}>
            {isLoading ? "Generating..." : "Generate Topics"}
          </Button>

          {!isSignedIn && !canGenerate && (
            <p className="text-sm text-muted-foreground text-center">Sign in to continue generating content</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSingleTopic } from "@/actions/dashboard/jobs/createSingleTopic";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { useAiQuota } from "@/hooks/use-ai-quota";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import type React from "react";

const timeDurations = [
  { value: "today", label: "Today (24 hours)" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
]

export function TopicGenerationForm({ categories }: { categories: Category[] }) {
  const { remainingRequests, canMakeRequest, decrementRequests } = useAiQuota()
  const [formData, setFormData] = useState({
    category: "",
    minTopics: 1,
    maxTopics: 5,
    timeDuration: "",
    prompt: "",
  })

  const mutation = useMutation({
    mutationFn: async () => await CreateSingleTopic({ categoryId: Number(formData.category), minTopics: formData.minTopics, maxTopics: formData.maxTopics, timeDuration: formData.timeDuration, prompt: formData.prompt }),
    onSuccess: () => {
      decrementRequests()
      toast.success(`Generation queued for ${formData.maxTopics} topics successfully!`)

      setFormData({
        category: "",
        minTopics: 1,
        maxTopics: 5,
        timeDuration: "",
        prompt: "",
      })
    },
    onError: (error) => toast.error(`Failed to generate topics. Please try again. ${error.message}`)
  })

  const handleClick = () => {
    if (!canMakeRequest()) {
      toast.error("You've reached your generation limit. Please sign up to continue.")
      return
    }

    if (!formData.category || !formData.timeDuration) {
      toast.error("Please select category and time duration")
      return
    }

    mutation.mutate()
    return
  }

  return (
    <Card className="border-0 shadow-lg bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleClick()
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger
                  className="w-full"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minTopics">Min Topics</Label>
              <Input
                id="minTopics"
                type="number"
                min="1"
                max="5"
                value={formData.minTopics}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minTopics: Number.parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTopics">Max Topics</Label>
              <Input
                id="maxTopics"
                type="number"
                min="5"
                max="10"
                value={formData.maxTopics}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxTopics: Number.parseInt(e.target.value) || 5,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeDuration">Time Duration</Label>
              <Select
                value={formData.timeDuration}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, timeDuration: value }))}
              >
                <SelectTrigger
                  className="w-full"
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {timeDurations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Optional Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Add specific instructions or context for topic generation..."
              value={formData.prompt}
              onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Remaining requests:{" "}
              <span className="font-medium text-primary">{remainingRequests}</span>
            </div>
            <ArticleGenerationButton isPending={mutation.isPending} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const ArticleGenerationButton = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      size="lg"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Topics
        </>
      )}
    </Button>
  )
}
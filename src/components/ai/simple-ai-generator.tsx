"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Heart, Zap } from "lucide-react"
import { useAiQuota } from "@/hooks/use-ai-quota"
import { useToast } from "@/hooks/use-toast"
import { generateTopics } from "@/lib/actions/ai-actions"

export function SimpleAiGenerator() {
  const [formData, setFormData] = useState({
    category: "",
    howMany: 5,
    aiInstructions: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const { canGenerate, isSignedIn } = useAiQuota()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!canGenerate) {
      toast({
        title: "Oops! You've reached your limit",
        description: "Sign in to keep creating amazing content!",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Pick a topic first!",
        description: "Choose what kind of content you'd like to create.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await generateTopics({
        categoryId: formData.category,
        minTopics: formData.howMany,
        maxTopics: formData.howMany,
        timeDuration: "24 hours",
        excludedTitles: [],
        trigger: "MANUAL",
        apiKey: "",
        aiInstructions: formData.aiInstructions,
      })
      toast({
        title: "Your content is being created!",
        description: "Sit back and relax - we're working on something amazing for you!",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Don't worry, try again in a moment!",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card border-2 border-border shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="font-serif text-3xl font-bold text-card-foreground mb-2">Let's Create Something Amazing</h2>
            <p className="text-muted-foreground">Tell us what you want, and we'll make it happen!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-lg font-semibold text-card-foreground">
                What topic interests you?
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Choose your favorite topic..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">🔧 Technology & Gadgets</SelectItem>
                  <SelectItem value="2">💪 Health & Wellness</SelectItem>
                  <SelectItem value="3">💼 Business & Money</SelectItem>
                  <SelectItem value="4">🔬 Science & Discovery</SelectItem>
                  <SelectItem value="5">🏛️ Politics & News</SelectItem>
                  <SelectItem value="6">🎨 Arts & Culture</SelectItem>
                  <SelectItem value="7">⚽ Sports & Entertainment</SelectItem>
                  <SelectItem value="8">🍳 Food & Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* How Many */}
            <div className="space-y-3">
              <Label htmlFor="howMany" className="text-lg font-semibold text-card-foreground">
                How many topics would you like?
              </Label>
              <div className="flex gap-3">
                {[3, 5, 8, 10].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={formData.howMany === num ? "default" : "outline"}
                    className="flex-1 h-12 text-lg"
                    onClick={() => setFormData((prev) => ({ ...prev, howMany: num }))}
                  >
                    {num} topics
                  </Button>
                ))}
              </div>
            </div>

            {/* AI Instructions */}
            <div className="space-y-3">
              <Label htmlFor="aiInstructions" className="text-lg font-semibold text-card-foreground">
                Any special requests? (Optional)
              </Label>
              <Textarea
                id="aiInstructions"
                placeholder="Tell us what style you prefer, what to focus on, or any special requirements..."
                value={formData.aiInstructions}
                onChange={(e) => setFormData((prev) => ({ ...prev, aiInstructions: e.target.value }))}
                className="min-h-24 text-base"
              />
              <p className="text-sm text-muted-foreground">
                For example: "Make it funny and engaging" or "Focus on beginner-friendly content"
              </p>
            </div>

            {/* Generate Button */}
            <Button
              type="submit"
              className="w-full h-16 text-xl font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
              disabled={isLoading || !canGenerate}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-foreground"></div>
                  Creating your content...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  Generate My Content Now!
                </div>
              )}
            </Button>

            {/* Sign in message */}
            {!isSignedIn && !canGenerate && (
              <div className="text-center p-6 bg-muted rounded-lg">
                <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Sign in to keep creating amazing content and unlock unlimited generations!
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Success Message Area */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">✨ Your content will appear here once it's ready - easy as pie! ✨</p>
      </div>
    </div>
  )
}

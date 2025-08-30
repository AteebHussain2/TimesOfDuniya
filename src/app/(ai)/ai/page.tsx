import { GeneratedTopicsSection } from "@/components/ai/generated-topics-section"
import { TopicGenerationForm } from "@/components/ai/topic-generation-form"
import { GetCategories } from "@/actions/site/categories/getCategories";
import { ArticlesSection } from "@/components/ai/articles-section"


export default async function AIDashboardPage() {
  const categories = await GetCategories();
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Content Studio</h1>
        <p className="text-muted-foreground">Generate topics and create articles with AI assistance</p>
      </div>

      <TopicGenerationForm categories={categories} />
      <GeneratedTopicsSection />
      <ArticlesSection />
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function WhatsNewCard() {
  const mockWhatsNew = [
    {
      id: "wn-1",
      title: "New AI Model Released: GPT-4.5 Turbo",
      date: "2025-08-01",
      summary: "Introducing the latest iteration of our generative AI model with enhanced capabilities.",
    },
    {
      id: "wn-2",
      title: "Dashboard UI Redesign Completed",
      date: "2025-07-28",
      summary: "Experience a fresh, intuitive interface for better monitoring.",
    },
    {
      id: "wn-3",
      title: "Improved Topic Generation Algorithm",
      date: "2025-07-25",
      summary: "Our CRON jobs now produce more relevant and diverse topics.",
    },
  ]

  return (
    <Card className="relative overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <Sparkles
        size={120}
        className="absolute -bottom-4 -right-8 opacity-10 transition-all duration-300 text-chart-5"
      />
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          What's New
        </CardTitle>
        <p className="text-muted-foreground">Latest updates and features</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockWhatsNew.map((item) => (
          <div key={item.id} className="space-y-1">
            <h3 className="font-semibold text-base">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
            <span className="text-xs text-muted-foreground">
              {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

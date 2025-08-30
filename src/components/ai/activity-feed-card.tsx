"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  { id: 1, action: "Topic generated", title: "AI Revolution in Healthcare", time: "2 min ago", status: "success" },
  { id: 2, action: "Article published", title: "Climate Change Solutions", time: "5 min ago", status: "success" },
  { id: 3, action: "Job failed", title: "Tech Trends 2024", time: "10 min ago", status: "error" },
]

export function ActivityFeedCard() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>What&apos;s New</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Badge variant={activity.status === "success" ? "default" : "destructive"} className="mt-0.5">
                {activity.status === "success" ? "✓" : "✗"}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CronBoxCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Scheduled Jobs
          </span>
          <Button size="sm" variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Daily Topic Generation</span>
            <Badge variant="secondary">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Weekly Article Cleanup</span>
            <Badge variant="outline">Inactive</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Next run: Today at 9:00 AM</p>
        </div>
      </CardContent>
    </Card>
  )
}

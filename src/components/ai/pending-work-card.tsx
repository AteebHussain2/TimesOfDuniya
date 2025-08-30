"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function PendingWorkCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Work</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Topics in Queue</span>
            <Badge variant="secondary">3</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Articles Processing</span>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <Badge variant="default">2</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Failed Jobs</span>
            <Badge variant="destructive">1</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle } from "lucide-react"

export function ManualUsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Topic Generation</span>
            <Button size="sm" variant="outline">
              <PlayCircle className="w-4 h-4 mr-2" />
              Start
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Article Processing</span>
            <Button size="sm" variant="outline">
              <PauseCircle className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

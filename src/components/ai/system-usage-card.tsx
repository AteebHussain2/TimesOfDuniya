"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAiQuota } from "@/hooks/use-ai-quota"

export function SystemUsageCard() {
  const { quota, isSignedIn } = useAiQuota()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Usage
          <Badge variant={isSignedIn ? "default" : "secondary"}>
            {isSignedIn ? "Unlimited" : `${quota.used}/${quota.limit}`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isSignedIn && (
          <div className="space-y-2">
            <Progress value={(quota.used / quota.limit) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground">{quota.remaining} generations remaining</p>
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Topics Generated</p>
            <p className="font-semibold">24</p>
          </div>
          <div>
            <p className="text-muted-foreground">Articles Created</p>
            <p className="font-semibold">18</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface Job {
  id: string
  status: "Queued" | "Processing" | "Completed" | "Failed"
  topicCount: number
  queueNumber: number
  progress?: number
}

interface JobStatusCardProps {
  job?: Job // Made job prop optional
}

export function JobStatusCard({ job }: JobStatusCardProps) {
  if (!job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Job Status</span>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              No Active Jobs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Start generating topics to see job status here.</p>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = () => {
    switch (job.status) {
      case "Queued":
        return <Clock className="w-4 h-4" />
      case "Processing":
        return <Loader2 className="w-4 h-4 animate-spin" />
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
      case "Failed":
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusVariant = () => {
    switch (job.status) {
      case "Queued":
        return "secondary"
      case "Processing":
        return "default"
      case "Completed":
        return "default"
      case "Failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Job Status</span>
          <Badge variant={getStatusVariant()} className="flex items-center gap-2">
            {getStatusIcon()}
            {job.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Job ID</p>
              <p className="font-mono">{job.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Topics</p>
              <p className="font-semibold">{job.topicCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Queue #</p>
              <p className="font-semibold">{job.queueNumber}</p>
            </div>
          </div>

          {job.status === "Processing" && job.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

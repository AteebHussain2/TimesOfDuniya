"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import type { ChartData } from "@/lib/types/dashboard"

interface AnalyticsChartProps {
  data: ChartData[]
  title: string
  description?: string
}

export function AnalyticsChart({ data, title, description }: AnalyticsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            views: {
              label: "Views",
              color: "hsl(var(--chart-1))",
            },
            likes: {
              label: "Likes",
              color: "hsl(var(--chart-2))",
            },
            comments: {
              label: "Comments",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} name="Likes" />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} name="Comments" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

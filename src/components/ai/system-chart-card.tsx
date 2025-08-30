"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", topics: 4, articles: 3 },
  { name: "Tue", topics: 6, articles: 4 },
  { name: "Wed", topics: 8, articles: 6 },
  { name: "Thu", topics: 5, articles: 4 },
  { name: "Fri", topics: 7, articles: 5 },
  { name: "Sat", topics: 3, articles: 2 },
  { name: "Sun", topics: 4, articles: 3 },
]

export function SystemChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="topics" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            <Line type="monotone" dataKey="articles" stroke="hsl(var(--chart-2))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

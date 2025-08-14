"use client"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GetJobsChartData } from "@/actions/dashboard/jobs/getJobsChartData";
import { BarChartIcon as ChartColumnStackedIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  success: {
    label: "Successful Jobs",
    color: "#22c55e", // Green
  },
  failed: {
    label: "Failed Jobs",
    color: "#3b82f6", // Blue
  },
}

interface JobsChartProps {
  data: Array<{
    date: string
    success: number
    failed: number
  }>
  title: string
  description: string
}

const JobsChart = ({ data, title, description }: JobsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ChartColumnStackedIcon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent className="w-[250px]" />} />
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              fill="#22c55e"
              stroke="#22c55e"
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              fill="#3b82f6"
              stroke="#3b82f6"
              dataKey={"failed"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default JobsChart

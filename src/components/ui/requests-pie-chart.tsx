"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

const DAILY_REQUEST_LIMIT = 800;

const chartConfig = {
  requestsMade: {
    label: "Requests Made",
    color: "var(--chart-1)",
  },
  requestsRemaining: {
    label: "Requests Remaining",
    color: "var(--chart-5)"
  },
}

export function SystemUsagePieChart({ totalRequests }: { totalRequests: number }) {
  const remainingRequests = DAILY_REQUEST_LIMIT - totalRequests;
  const totalValueForPercentages = DAILY_REQUEST_LIMIT;

  const data = [
    { name: "Requests Made", value: totalRequests, color: chartConfig.requestsMade.color },
    { name: "Requests Remaining", value: remainingRequests, color: chartConfig.requestsRemaining.color },
  ];

  return (
    <Card className="relative overflow-hidden" style={{ border: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <CardContent className="flex flex-col p-5 justify-center py-3 gap-3 items-center">
        {/* Chart Area */}
        <div className="relative flex-1 min-w-[200px] max-w-[300px] h-[220px] flex items-center justify-center">
          <ChartContainer config={chartConfig} className="w-full h-[182px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value: unknown, name: unknown) => {
                        const numericValue = typeof value === "number" ? value : Number(value)
                        const label = typeof name === "string" ? name : String(name)
                        const percentage =
                          totalValueForPercentages > 0 ? ((numericValue / totalValueForPercentages) * 100).toFixed(1) : 0
                        return [`${label}: ${numericValue.toLocaleString()} (${percentage}%)`]
                      }}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  cornerRadius={5}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {/* Center Text: Daily Limit Value */}
          <div className="absolute text-center">
            <div className="text-2xl font-bold text-foreground">{DAILY_REQUEST_LIMIT.toLocaleString()}</div>
          </div>
        </div>

        {/* Legend Area (now centered below chart) */}
        <div className="flex h-full flex-row mt-4 md:mt-0 items-center justify-center gap-3">
          <div className="flex items-center text-sm">
            <span className="size-3 rounded-full mr-2" style={{ backgroundColor: chartConfig.requestsMade.color }} />
            <span className="text-muted-foreground">
              {totalValueForPercentages > 0
                ? ((totalRequests / totalValueForPercentages) * 100).toFixed(0)
                : 0}
              %
            </span>
            <span className="font-medium ml-1">Requests Made</span>
          </div>
          <div className="flex items-center text-sm">
            <span
              className="size-3 rounded-full mr-2"
              style={{ backgroundColor: chartConfig.requestsRemaining.color }}
            />
            <span className="text-muted-foreground">
              {totalValueForPercentages > 0
                ? ((remainingRequests / totalValueForPercentages) * 100).toFixed(0)
                : 0}
              %
            </span>
            <span className="font-medium ml-1">Requests Remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

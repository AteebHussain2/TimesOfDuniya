import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper"
import { cn } from "@/lib/utils"
import type React from "react"

interface StatsCardProps {
  title: string
  value: number
  change: number
  icon: LucideIcon
  iconClass?: string
  format?: "number" | "percentage"
}

const DashboardStatsCard = (props: StatsCardProps) => {
  // const formatValue = (val: number) => {
  //   if (props.format === "percentage") return `${val}%`
  //   return val.toLocaleString()
  // }

  const isPositive = props.change >= 0

  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <props.icon
          size={120}
          className={cn("text-muted-foreground absolute -bottom-4 -right-8 opacity-10",
            props.iconClass
          )}
        />
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={props.value} />
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}
            {props.change}%
          </span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card >
  )
}

export default DashboardStatsCard;

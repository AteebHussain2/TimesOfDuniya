"use client"
import { SystemUsageCard } from "./system-usage-card"
import { SystemChartCard } from "./system-chart-card"
import { ManualUsageCard } from "./manual-usage-card"
import { CronBoxCard } from "./cron-box-card"
import { PendingWorkCard } from "./pending-work-card"
import { ActivityFeedCard } from "./activity-feed-card"

export function BentoTopGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Column 1 */}
      <div className="space-y-6">
        <SystemUsageCard />
        <SystemChartCard />
        <ManualUsageCard />
      </div>

      {/* Column 2 */}
      <div className="space-y-6">
        <CronBoxCard />
        <PendingWorkCard />
        <ActivityFeedCard />
      </div>
    </div>
  )
}

import GenerateTopicsButton from "@/components/dashboard/GenerateTopicsButton";
import { GetCronRequests } from "@/actions/dashboard/jobs/getCronRequests";
import CronAnalyticsCard from "@/components/dashboard/CronAnalyticsCard";
import { SystemUsagePieChart } from "@/components/ui/requests-pie-chart";
import JobsChartSection from "@/components/dashboard/JobsChartSection";
import SystemUsageCard from "@/components/dashboard/SystemUsageCard";
import ManualUsageCard from "@/components/dashboard/ManualUsageCard";
import PendingWorkCard from "@/components/dashboard/PendingWorkCard";
import ManualArticles from "@/components/dashboard/ManualArticles";
import { WhatsNewCard } from "@/components/ui/whats-new-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function DashboardPage({ role }: { role: string }) {
    return (
        <div className="space-y-8">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">System Overview</h2>
                        <p className="text-muted-foreground">Real-time analytics and pending work items</p>
                    </div>
                    <GenerateTopicsButton role={role} />
                </div>

                {/* Bento Box Grid Layout (2 Columns, 3 Rows conceptually) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="flex flex-col gap-6">
                        <SystemUsageCard />

                        <SystemUsageChart />

                        <ManualUsageCard />
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-6">
                        <CronAnalyticsCard />

                        {/* Row 2: Pending Work Items */}
                        <PendingWorkCard />

                        {/* Row 3: What's New */}
                        <WhatsNewCard />
                    </div>
                </div>
            </section>

            {/* Jobs Performance Chart */}
            <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
                <JobsChartSection />
            </Suspense>

            <Separator className="my-8" />

            {/* MANUAL Section (Original Stat Cards) */}
            <ManualArticles />
        </div>
    )
}


export async function SystemUsageChart() {
    const totalRequests = await GetCronRequests();

    return (
        <SystemUsagePieChart totalRequests={totalRequests} />
    )
}
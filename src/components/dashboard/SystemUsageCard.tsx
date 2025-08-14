import { GetCombinedUsage } from "@/actions/dashboard/jobs/getCombinedUsage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactCountUpWrapper from "../ReactCountUpWrapper";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const SystemUsageCard = async () => {
    const usageStats = await GetCombinedUsage();

    const getSystemHealthColor = {
        "Healthy": "text-green-600",
        "Warning": "text-yellow-600",
        "Critical": "text-red-600"
    }

    const getSuccessRateColor = (rate: number) => {
        if (rate >= 90) {
            return "text-green-600"
        } else if (rate >= 75) {
            return "text-yellow-600"
        } else {
            return "text-red-600"
        }
    }

    return (
        <Card
            className="relative overflow-hidden flex-shrink-0 border-separate"
        >
            <BarChart3
                size={120}
                className="text-muted-foreground absolute -bottom-4 -right-8 opacity-10 transition-all duration-300"
            />
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    System Usage
                </CardTitle>
                <p className="text-muted-foreground">Combined CRON + Manual operations</p>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-primary mb-4">
                    <ReactCountUpWrapper value={usageStats?.requestsMade ?? 0} />
                </div>
                <div className="text-sm text-muted-foreground mb-6">Total requests processed this month</div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Success Rate</span>
                        <span className={cn("text-lg font-semibold text-right", getSuccessRateColor(Number(usageStats?.successRate)))}>
                            <ReactCountUpWrapper value={Number(usageStats?.successRate ?? 0)} />%
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Tokens Used</span>
                        <span className="text-lg font-semibold text-right">
                            <ReactCountUpWrapper value={Math.floor((usageStats?.tokensUsed ?? 0) / 1000)} />K
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">System Health</span>
                        <span className={cn("text-lg font-semibol text-right", getSystemHealthColor[usageStats?.systemHealth])}>{usageStats?.systemHealth}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SystemUsageCard

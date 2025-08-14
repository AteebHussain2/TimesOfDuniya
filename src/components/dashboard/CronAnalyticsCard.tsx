import { GetCronUsageStats } from '@/actions/dashboard/jobs/getCronUsageStats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ReactCountUpWrapper from '../ReactCountUpWrapper';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const CronAnalyticsCard = async () => {
    const cronUsage = await GetCronUsageStats();

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
            <Zap
                size={120}
                className="absolute -bottom-4 -right-8 opacity-10 transition-all duration-300 text-chart-1"
            />
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    CRON Analytics
                </CardTitle>
                <p className="text-muted-foreground">Automated processes</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-primary">
                        <ReactCountUpWrapper value={cronUsage?.requests ?? 0} />
                    </div>
                    <div className="text-xs text-muted-foreground">Requests/Day</div>
                </div>

                <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-primary">
                        <ReactCountUpWrapper value={Math.floor(((cronUsage?.tokensUsed ?? 0) / 1000))} />K
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens Used</div>
                </div>

                <div className="flex flex-col items-start">
                    <div className={cn("text-2xl font-bold", getSuccessRateColor(Number(cronUsage?.successRate)))}>
                        <ReactCountUpWrapper value={Number(cronUsage?.successRate) ?? 0} />%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>

                <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold text-primary">
                        <ReactCountUpWrapper value={cronUsage?.totalJobs ?? 0} />
                    </div>
                    <div className="text-xs text-muted-foreground">Total Jobs</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CronAnalyticsCard

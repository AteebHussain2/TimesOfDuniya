import { GetManualUsage } from "@/actions/dashboard/jobs/getManualUsage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ReactCountUpWrapper from "../ReactCountUpWrapper";
import { Users } from "lucide-react";

const ManualUsageCard = async () => {
    const manualUsage = await GetManualUsage();

    return (
        <Card
            className="relative overflow-hidden flex-grow border-separate"
        >
            <Users
                size={120}
                className="absolute -bottom-4 -right-8 opacity-10 transition-all duration-300 text-chart-3"
            />
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    Manual Usage
                </CardTitle>
                <p className="text-muted-foreground">User-triggered requests from /ai for this month</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Unique Users</span>
                        <span className="text-lg font-semibold text-primary text-right">
                            <ReactCountUpWrapper value={manualUsage?.uniqueUsers ?? 0} />
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Total Requests</span>
                        <span className="text-lg font-semibold text-primary text-right">
                            <ReactCountUpWrapper value={manualUsage?.totalRequests ?? 0} />
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Topics Created</span>
                        <span className="text-lg font-semibold text-primary text-right">
                            <ReactCountUpWrapper value={manualUsage?.topicsCreated ?? 0} />
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-left">Articles Created</span>
                        <span className="text-lg font-semibold text-primary text-right">
                            <ReactCountUpWrapper value={manualUsage?.articlesCreated ?? 0} />
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ManualUsageCard

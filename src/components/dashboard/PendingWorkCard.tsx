import { GetCronPendingWork } from '@/actions/dashboard/jobs/getCronPendingWork';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ReactCountUpWrapper from '../ReactCountUpWrapper';
import { FileText } from 'lucide-react';
import Link from 'next/link';

const PendingWorkCard = async () => {
    const cronPendingWork = await GetCronPendingWork();

    return (
        <Link href={'/cron/jobs'}>
            <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex-shrink-0 border-separate">
                <FileText
                    size={120}
                    className="absolute -bottom-4 -right-8 opacity-10 transition-all duration-300 text-chart-4"
                />
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Pending Work
                    </CardTitle>
                    <p className="text-muted-foreground">Items awaiting processing</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-left">Jobs In Queue</span>
                            <span className="text-3xl font-bold text-primary text-right">
                                <ReactCountUpWrapper value={cronPendingWork?.queuedJobs ?? 0} />
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-left">Pending Topics</span>
                            <span className="text-3xl font-bold text-primary text-right">
                                <ReactCountUpWrapper value={cronPendingWork?.pendingTopics ?? 0} />
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-left">Draft Articles</span>
                            <span className="text-3xl font-bold text-primary text-right">
                                <ReactCountUpWrapper value={cronPendingWork?.pendingArticles ?? 0} />
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default PendingWorkCard

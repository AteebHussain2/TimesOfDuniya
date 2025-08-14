import { GetJobsChartData } from '@/actions/dashboard/jobs/getJobsChartData';
import JobsChart from '../ui/jobs-chart'

const JobsChartSection = async () => {
    const jobsChartData = await GetJobsChartData();

    return (
        <section>
            <JobsChart
                data={jobsChartData ?? []}
                title="Jobs Performance"
                description="Daily breakdown of successful and failed job executions over the past 20 days"
            />
        </section>
    )
}

export default JobsChartSection

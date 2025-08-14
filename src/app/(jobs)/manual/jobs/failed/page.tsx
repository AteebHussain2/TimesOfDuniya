import { GetFailedJobs } from "@/actions/dashboard/jobs/getFailedJobs";
import { JobCard } from "@/components/JobCard"
import { differenceInDays } from "date-fns";
import { TRIGGER } from "@prisma/client";

export default async function FailedJobsPage() {
  const failedJobs = await GetFailedJobs(TRIGGER.MANUAL);

  const isLessThan3DaysOld = (updatedAt: Date) => {
    const bool = differenceInDays(new Date(), updatedAt) <= 3;
    return bool
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Failed Jobs</h1>
      <p className="text-muted-foreground mb-6">Jobs that encountered errors during processing.</p>

      {failedJobs.length > 0 ? (
        failedJobs.map((job) => (
          <JobCard key={job.id} job={job} showGenerateButton={isLessThan3DaysOld(job.createdAt)} />
        ))
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">No Failed Jobs</h3>
          <p>All jobs are currently running successfully or are completed.</p>
        </div>
      )}
    </div>
  )
}

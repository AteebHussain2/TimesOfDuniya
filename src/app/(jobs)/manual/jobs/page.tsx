export const revalidate = 30;

import { GetPendingJobs } from "@/actions/dashboard/jobs/getPendingJobs";
import { JobCard } from "@/components/JobCard"
import { TRIGGER } from "@prisma/client";

export default async function PendingJobsPage() {
  const pendingJobs = await GetPendingJobs(TRIGGER.MANUAL);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Pending Jobs</h1>
      <p className="text-muted-foreground mb-6">Jobs awaiting article generation.</p>

      {pendingJobs.length > 0 ? (
        pendingJobs.map((job) => <JobCard key={job.id} job={job} showGenerateButton={true} />)
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">No Pending Jobs</h3>
          <p>All topics have been generated or no new jobs are pending.</p>
        </div>
      )}
    </div>
  )
}

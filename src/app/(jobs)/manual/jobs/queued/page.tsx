import { GetQueuedJob } from "@/actions/dashboard/jobs/getQueuedJobs";
import { JobCard } from "@/components/JobCard"
import { TRIGGER } from "@prisma/client";

export default async function FailedJobsPage() {
  const queuedJobs = await GetQueuedJob(TRIGGER.MANUAL);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Queued Jobs</h1>
      <p className="text-muted-foreground mb-6">Jobs that are in queued for processing.</p>

      {queuedJobs.length > 0 ? (
        queuedJobs.map((job) => (
          <JobCard key={job.id} job={job} showGenerateButton={false} />
        ))
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">No Queued Jobs</h3>
          <p>All jobs are currently running successfully or are completed.</p>
        </div>
      )}
    </div>
  )
}

export const revalidate = 30;

import { GetSuccessfulJobs } from "@/actions/dashboard/jobs/getSuccessfulJobs";
import { JobCard } from "@/components/JobCard";
import { TRIGGER } from "@prisma/client";

export default async function SuccessfulJobsPage() {
  const successfulJobs = await GetSuccessfulJobs(TRIGGER.MANUAL);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Successful Jobs</h1>
      <p className="text-muted-foreground mb-6">Jobs with successfully generated articles.</p>

      {successfulJobs.length > 0 ? (
        successfulJobs.map((job) => <JobCard key={job.id} job={job} showGenerateButton={false} />)
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <h3 className="text-lg font-semibold mb-2">No Successful Jobs</h3>
          <p>No jobs have completed article generation yet.</p>
        </div>
      )}
    </div>
  )
}

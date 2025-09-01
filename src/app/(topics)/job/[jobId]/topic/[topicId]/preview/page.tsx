export const revalidate = 60;

import { GetJobWithTopicsAndArticlesById } from '@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById';
import { TopicsSidebar } from '@/components/layout/topics-sidebar';
import { ArticlePreview } from './_components/ArticlePreview';
import TopBar from '@/components/layout/topbar/TopBar';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react';

const page = async ({ params }: { params: Promise<{ jobId: string, topicId: string }> }) => {
  const { jobId, topicId } = await params;
  const job = await GetJobWithTopicsAndArticlesById(Number(jobId));
  const article = job?.articles?.find(article => article.topicId === Number(topicId));

  return (
    <div className="w-full h-full flex">
      {/* Sidebar */}
      <TopicsSidebar job={job} />

      <div className="w-full h-screen overflow-auto">
        <TopBar
          jobId={Number(jobId)}
          topicId={Number(topicId)}
          title="Topics & Articles"
          isPublished={article?.publishedAt ? true : false}
          subtitle={'List of topics & articles for this job'}
        />

        {/* Main content */}
        <div className="flex-1 min-h-0 p-6 overflow-y-auto">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Loader2Icon
                  size={30}
                  className="animate-spin h-10 w-10 stroke-primary"
                />
              </div>
            }
          >
            <ArticlePreview job={job} topicId={Number(topicId)} />
          </Suspense>
        </div>
      </div>

    </div>
  )
}

export default page

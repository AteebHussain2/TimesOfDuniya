"use client";

import { GetJobWithTopicsAndArticlesById } from '@/actions/dashboard/jobs/getJobWithTopicsAndArticlesById';
import { TopicsSidebar } from '@/components/layout/topics-sidebar';
import { ArticlePreview } from './_components/ArticlePreview';
import TopBar from '@/components/layout/topbar/TopBar';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

const page = ({ params }: { params: Promise<{ jobId: string, topicId: string }> }) => {
  const [jobId, setJobId] = useState<Number>()
  const [topicId, setTopicId] = useState<Number>()
  const { data: job, isLoading } = useQuery({
    queryFn: async () => {
      const { jobId, topicId } = await params;
      setJobId(Number(jobId))
      setTopicId(Number(topicId))
      return await GetJobWithTopicsAndArticlesById(Number(jobId));
    },
    queryKey: ['job', jobId, topicId],
    refetchInterval: 10 * 1000
  })

  if (!job || isLoading) {
    return (
      <div className='w-full min-h-screen flex flex-col gap-2 items-center justify-center'>
        <Logo />
        <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
        <p className="text-muted-foreground test-sm">Loading....</p>
      </div>
    )
  }

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
          {/* <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Loader2Icon
                  size={30}
                  className="animate-spin h-10 w-10 stroke-primary"
                />
              </div>
            }
          >
          </Suspense> */}
          <ArticlePreview job={job} topicId={Number(topicId)} />
        </div>
      </div>

    </div>
  )
}

export default page

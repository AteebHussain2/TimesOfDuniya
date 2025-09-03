'use client';

import { GenerateArticle, GetJobByTopicIdAndJobId } from "@/actions/dashboard/jobs/generateArticle";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { STATUS } from "@prisma/client";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const ExecuteButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    const ExecuteMutation = useMutation({
        mutationFn: () => GenerateArticle(jobId, topicId),
        onSuccess: () => toast.success("Added to queue successfully!", { id: "generate-article" }),
        onError: () => toast.error("An error occurred while adding to queue!", { id: "generate-article" }),
    });

    const handleExecute = async () => {
        toast.loading("Adding to queue...", { id: "generate-article" });

        const job = await GetJobByTopicIdAndJobId(jobId, topicId)

        if (!job) {
            toast.error("Job not found", { id: "generate-article" });
            return;
        }

        if (job.topics.length === 0) {
            toast.error("Topic not found in this job!", { id: "generate-article" });
            return;
        }

        if (job.topics.some(topic => topic.status === STATUS.PROCESSING || topic.status === STATUS.QUEUED)) {
            toast.error("Article generation in process!", { id: "generate-article" });
            return;
        }

        if (job.articles.some(article => article.topicId === topicId)) {
            toast.info("Article exists! Regenerating article for this topic...");
        }

        ExecuteMutation.mutate();
        return;
    }

    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2"
            disabled={ExecuteMutation.isPending}
            onClick={handleExecute}
        >
            <Sparkles size={16} className="stroke-orange-400" />
            Generate
        </Button>
    )
}

export default ExecuteButton;
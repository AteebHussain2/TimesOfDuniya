'use client';

import { UnPublishArticle } from "@/actions/dashboard/jobs/unPublishArticle";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

const UnPublishButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    const UnPublishMutation = useMutation({
        mutationFn: () => UnPublishArticle(jobId, topicId),
        onSuccess: () => toast.success("Added to queue successfully!", { id: "publish-article" }),
        onError: (error: Error) => toast.error(error?.message || "An error occurred while adding to queue!", { id: "publish-article" }),
    });

    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2"
            disabled={UnPublishMutation.isPending}
            onClick={() => {
                toast.loading("Publishing article...", { id: "publish-article" });
                UnPublishMutation.mutate();
            }}
        >
            <DownloadIcon size={16} className="stroke-orange-400" />
            UnPublish
        </Button>
    )
}

export default UnPublishButton

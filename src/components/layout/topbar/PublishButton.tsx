'use client';

import { PublishArticle } from "@/actions/dashboard/jobs/publishArticle";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

const PublishButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    const PublishMutation = useMutation({
        mutationFn: () => PublishArticle(jobId, topicId),
        onSuccess: () => toast.success("Article published successfully!", { id: "publish-article" }),
        onError: () => toast.error("An error occurred while publishing artilce!", { id: "publish-article" }),
    });

    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2"
            disabled={PublishMutation.isPending}
            onClick={() => {
                toast.loading("Publishing article...", { id: "publish-article" });
                PublishMutation.mutate();
            }}
        >
            <UploadIcon size={16} className="stroke-green-400" />
            Publish
        </Button >
    )
}

export default PublishButton

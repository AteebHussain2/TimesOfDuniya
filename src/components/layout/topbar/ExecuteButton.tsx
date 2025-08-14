'use client';

import { GenerateArticle } from "@/actions/dashboard/jobs/generateArticle";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const ExecuteButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    const ExecuteMutation = useMutation({
        mutationFn: () => GenerateArticle(jobId, topicId),
        onSuccess: (data) => toast.success("Added to queue successfully!", { id: "generate-article" }),
        onError: (error: Error) => toast.error(error?.message || "An error occurred while adding to queue!", { id: "generate-article" }),
    });

    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2"
            disabled={ExecuteMutation.isPending}
            onClick={() => {
                toast.loading("Adding to queue...", { id: "generate-article" });
                ExecuteMutation.mutate();
            }}
        >
            <Sparkles size={16} className="stroke-orange-400" />
            Generate
        </Button>
    )
}

export default ExecuteButton;
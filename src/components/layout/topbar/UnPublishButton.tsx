'use client';

// import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
// import { toast } from "sonner";

const UnPublishButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    console.log({ jobId, topicId });
    return (
        <Button
            variant={'outline'}
            className="flex items-center gap-2"
            disabled={false}
        >
            <DownloadIcon size={16} className="stroke-orange-400" />
            UnPublish
        </Button>
    )
}

export default UnPublishButton

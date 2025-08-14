'use client';

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon } from "lucide-react";
import { toast } from "sonner";

const SaveButton = ({ jobId, topicId }: { jobId: number, topicId: number }) => {

    return (
        <Button
            disabled={false}
            variant={"outline"}
            className="flex items-center gap-2"
            onClick={() => { }}
        >
            <CloudUploadIcon size={20} className="stroke-green-600 size-5" />
            Save
        </Button >
    )
}

export default SaveButton

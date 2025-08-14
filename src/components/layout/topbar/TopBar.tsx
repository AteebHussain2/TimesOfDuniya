'use client';

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import SaveButton from "./SaveButton";
import ExecuteButton from "./ExecuteButton";
import NavigationTabs from "./NavigationTabs";
import PublishButton from "./PublishButton";
import UnPublishButton from "./UnPublishButton";

interface Props {
    title: string;
    subtitle: string | null;
    jobId: number;
    topicId: number;
    hideButtons?: boolean;
    isPublished?: boolean;
}

const TopBar = ({
    title,
    subtitle,
    jobId,
    topicId,
    hideButtons = false,
    isPublished = false,
}: Props) => {
    const router = useRouter();

    return (
        <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10">
            <div className="flex flex-1 gap-1">
                <TooltipWrapper content="Go Back">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="cursor-pointer flex items-center justify-center"
                        onClick={() => {
                            router.push('/cron/jobs');
                        }}
                    >
                        <ChevronLeftIcon size={20} className="size-5" />
                    </Button>
                </TooltipWrapper>
                <div className="flex flex-col justify-center items-start">
                    <p className="font-bold text-ellipsis truncate">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground truncate text-ellipsis">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            <NavigationTabs jobId={jobId} topicId={topicId} />

            <div className="flex flex-1 gap-1 justify-end">
                {!hideButtons && (
                    <>
                        {!isPublished &&
                            (
                                <>
                                    <ExecuteButton jobId={jobId} topicId={topicId} />
                                    <PublishButton jobId={jobId} topicId={topicId} />
                                </>
                            )
                        }
                    </>
                )}
            </div>
        </header >
    )
}

export default TopBar

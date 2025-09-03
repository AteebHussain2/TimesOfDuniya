'use client';

import TooltipWrapper from "@/components/TooltipWrapper";
import { ChevronLeftIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UnPublishButton from "./UnPublishButton";
// import NavigationTabs from "./NavigationTabs";
import { useLayout } from "../layout-context";
import ExecuteButton from "./ExecuteButton";
import PublishButton from "./PublishButton";
import { useRouter } from "next/navigation";
// import SaveButton from "./SaveButton";

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
    const { toggleMobileSidebar } = useLayout()

    return (
        <header className="flex p-2 border-b-2 border-separate justify-between items-center w-full h-[60px] sticky top-0 bg-background z-10">
            <div className="flex flex-1 gap-1">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileSidebar}>
                    <Menu className="w-5 h-5" />
                </Button>
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

            {/* <NavigationTabs jobId={jobId} topicId={topicId} /> */}

            <div className="flex flex-1 gap-1 justify-end">
                {!hideButtons && (
                    <>
                        {!isPublished ? (
                            <>
                                <ExecuteButton jobId={jobId} topicId={topicId} />
                                <PublishButton jobId={jobId} topicId={topicId} />
                            </>
                        ): (
                        <UnPublishButton jobId={jobId} topicId={topicId} />
                        )}
                    </>
                )}
            </div>
        </header >
    )
}

export default TopBar

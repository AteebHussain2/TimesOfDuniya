'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavigationTabs = ({ jobId, topicId }: { jobId: number, topicId: number }) => {
    const pathName = usePathname();
    const activeValue = pathName?.split('/')[5];

    return (
        <Tabs value={activeValue} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <Link href={`/job/${jobId}/topic/${topicId}/editor`}>
                    <TabsTrigger
                        value="editor"
                        className={cn("w-full")}
                    >
                        Editor
                    </TabsTrigger>
                </Link>
                <Link href={`/job/${jobId}/topic/${topicId}/preview`}>
                    <TabsTrigger
                        value="preview"
                        className={cn("w-full")}
                    >
                        Preview
                    </TabsTrigger>
                </Link>
            </TabsList>
        </Tabs>
    )
}

export default NavigationTabs

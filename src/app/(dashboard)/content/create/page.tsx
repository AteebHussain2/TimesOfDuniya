'use client';

import CreatePostForm from "./_components/CreatePostForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const page = () => {

    return (
        <div className="w-full flex flex-col items-start gap-4 bg-background hide-scrollbar">
            <div className="flex items-center gap-1 px-8 py-2">
                <Button
                    variant={"ghost"}
                    asChild
                >
                    <Link href={'/content'}>
                        <ArrowLeftIcon size={20} className="size-[20px] !p-0 !m-0" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-semibold">Create Post</h1>
            </div>

            <Separator />

            <CreatePostForm />
        </div>
    )
}

export default page;
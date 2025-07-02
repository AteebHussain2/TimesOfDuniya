"use client";

import { GetBreakingNews } from "@/actions/site/posts/getBreakingNews";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Dot } from "lucide-react";

export default function BreakingNewsTicker() {
    const { data: breakingNews, isPending } = useQuery({
        queryFn: GetBreakingNews,
        queryKey: ['ten-latest-posts'],
    })

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            if (breakingNews && breakingNews.length > 0) {
                setCurrentIndex((prev) => (prev + 1) % breakingNews.length)
            }
        }, 4000);
        return () => clearInterval(interval)
    }, [breakingNews?.length, breakingNews])

    return (
        <div className="bg-rose-600 dark:bg-rose-700 text-white py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Badge variant="secondary" className="flex items-center bg-white text-rose-600 dark:text-rose-700 mr-4 flex-shrink-0">
                        <span className="relative flex items-center justify-center">
                            <span className="animate-ping absolute rounded-full w-[12px] h-[12px] bg-foreground/20"></span>
                            <Dot className="text-rose-600 !w-5 !h-5 min-w-5 min-h-5" size={24} />
                        </span>

                        <span className="hidden sm:inline">BREAKING</span>
                    </Badge>
                    <div className="flex-1 overflow-hidden">
                        <div
                            className="whitespace-nowrap transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {!isPending ? breakingNews?.map((news, index) => (
                                <span key={index} className="inline-block w-full truncate">
                                    {news.title || 'Do You Know: Supporting us is always appreciated...'}
                                </span>
                            )) : (
                                <span className="inline-block w-full truncate">
                                    Do You Know: Supporting us is always appreciated...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
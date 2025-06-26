"use client";

import { GetBreakingNews } from "@/actions/site/posts/getLatestPosts";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function BreakingNewsTicker() {
    const { data: breakingNews } = useQuery({
        queryFn: GetBreakingNews,
        queryKey: ['ten-latest-posts'],
    })

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % breakingNews?.length!)
        }, 4000);

        return () => clearInterval(interval)
    }, [breakingNews?.length])

    return (
        <div className="bg-rose-600 dark:bg-rose-700 text-white py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Badge variant="secondary" className="bg-white text-rose-600 dark:text-rose-700 mr-4 flex-shrink-0">
                        BREAKING
                    </Badge>
                    <div className="flex-1 overflow-hidden">
                        <div
                            className="whitespace-nowrap transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {breakingNews?.map((news, index) => (
                                <span key={index} className="inline-block w-full truncate">
                                    {news.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
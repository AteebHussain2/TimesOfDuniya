"use client";

import { Carousel, CarouselContent, CarouselItem, } from "@/components/ui/carousel";
import { GetBreakingNews } from "@/actions/site/posts/getBreakingNews";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { Dot } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";


export default function BreakingNewsTicker() {
    const plugin = useRef(
        Autoplay({ delay: 8000, stopOnInteraction: true })
    )

    const { data: breakingNews, isPending } = useQuery({
        queryFn: GetBreakingNews,
        queryKey: ['ten-latest-posts'],
    })

    return (
        <div className="bg-rose-600 dark:bg-rose-700 text-white py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Badge variant="default" className="flex items-center bg-white text-rose-600 dark:text-rose-700 mr-4 flex-shrink-0">
                        <span className="relative flex items-center justify-center">
                            <span className="animate-ping absolute rounded-full w-[12px] h-[12px] bg-foreground/20"></span>
                            <Dot className="text-rose-600 !w-5 !h-5 min-w-5 min-h-5" size={24} />
                        </span>

                        <span className="hidden sm:inline">BREAKING</span>
                    </Badge>

                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent className="w-full">
                            {!isPending ? breakingNews?.map((news, index) => (
                                <CarouselItem key={index}>
                                    <Link href={`/post/${news.id}/${news.slug}`} className="inline-block w-full truncate">
                                        {news.title || 'Do You Know: Supporting us is always appreciated...'}
                                    </Link>
                                </CarouselItem>
                            )) : (
                                <CarouselItem>
                                    <Link href={`https://dynamic-portfolios.vercel.app/ateeb`} target="_blank" className="inline-block w-full truncate">
                                        Do You Know: Supporting us is always appreciated...
                                    </Link>
                                </CarouselItem>
                            )}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingPosts } from "../RecommendationSections";
// import { Calendar, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrendingSidebar() {
    return (
        <div className="w-full xl:w-80 bg-background p-4 lg:p-6 space-y-6">
            {/* Trending Posts */}
            <TrendingPosts limit={5} showInSidebar={true} />

            {/* Quick Stats */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Today's Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-muted-foreground">Total Views</span>
                        </div>
                        <span className="text-sm font-semibold">127.5K</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-muted-foreground">Active Readers</span>
                        </div>
                        <span className="text-sm font-semibold">8.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-muted-foreground">Articles Today</span>
                        </div>
                        <span className="text-sm font-semibold">24</span>
                    </div>
                </CardContent>
            </Card> */}

            {/* Categories Quick Access */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                        {["International", "Pakistan", "Technology", "Sports", "Business", "Health", "Entertainment", "Anime"].map((category) => (
                            <Button key={category} variant="outline" size="sm" asChild className="h-8 text-xs">
                                <a href={`/category/${category.toLowerCase()}`}>{category}</a>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
import { GetManualUnpublishedArticles } from "@/actions/dashboard/jobs/getManualUnpublishedArticles";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import ArticleListItem from "../ui/article-list-item"
import { FileText } from "lucide-react";

type Article = {
    id: number,
    title: string,
    author: string,
    createdAt: Date,
    thumbnail: string,
    views: number,
}

const ManualArticles = async () => {
    const manualUnpublishedArticles: Awaited<ReturnType<typeof GetManualUnpublishedArticles>> = await GetManualUnpublishedArticles();

    return (
        <section className="space-y-4">
            <Card className="border-separate">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">
                                Recent Unpublished Articles
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Articles waiting for review and publication
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {(manualUnpublishedArticles && manualUnpublishedArticles.length !== 0) ? (
                        <div className="divide-y divide-border rounded-md border">
                            {manualUnpublishedArticles.map((article, index) => (
                                <div
                                    key={article.id}
                                    className="px-6 transition-colors hover:bg-muted/50"
                                >
                                    <ArticleListItem
                                        id={article.id}
                                        title={article.title}
                                        category={article.category.name}
                                        createdAt={article.createdAt}
                                        thumbnail={article.thumbnail || ''}
                                        last={index === manualUnpublishedArticles.length - 1}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50 hover:bg-muted/50 transition-colors">
                            <div className="relative">
                                <FileText className="h-14 w-14 text-muted-foreground mb-4 animate-pulse" />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-foreground/40 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-muted-foreground/60"></span>
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold tracking-tight">No Articles Found</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-[180px]">
                                Your unpublished articles will appear here once generated.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}

export default ManualArticles

import { GetAllManualTopics } from "@/actions/dashboard/jobs/GetAllManualTopics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { STATUS } from "@prisma/client"
import Link from "next/link"

export default async function TopicsPage() {
  const topics = await GetAllManualTopics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generated Topics</h1>
          <p className="text-muted-foreground">View and manage your AI-generated topics</p>
        </div>
        <Button asChild>
          <Link href="/ai">Generate New Topics</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{topic.job.category.name}</Badge>
                    <Badge variant={topic.status === STATUS.COMPLETED ? "default" : "secondary"}>{topic.status}</Badge>
                    {topic.articles.length !== 0 && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <FileText className="w-3 h-3 mr-1" />
                        Article Ready
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/ai/topics/${topic.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-start flex-col gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                Created {topic.createdAt.toLocaleDateString()}
              </div>

              <div className="w-full flex sm:hidden items-center gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/ai/topics/${topic.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

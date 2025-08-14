import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, MessageCircle, ExternalLink } from "lucide-react"
import type { TopPost } from "@/lib/types/dashboard"
import Link from "next/link"

interface TopPostsTableProps {
  posts: TopPost[]
  title: string
  description?: string
}

export function TopPostsTable({ posts, title, description }: TopPostsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="max-w-[300px]">
                    <div className="font-medium truncate">{post.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{post.category}</Badge>
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {post.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {post.likes.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    {post.comments.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/analytics/${post.id}/${post.slug}`}>Analytics</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/post/${post.slug}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

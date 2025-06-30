import { notFound } from "next/navigation";
import { Image } from "@imagekit/next";
import { GetPostsByAuthor } from "@/actions/site/posts/getPostsByAuthor";
import PostCard from "@/components/posts/PostCard";
import { Card, CardContent } from "@/components/ui/card";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const posts = await GetPostsByAuthor(username);

  if (posts.length === 0) {
    notFound()
  }

  const author = posts[0].author

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Author Header */}
        <Card className="bg-white rounded-lg shadow-md p-8 mb-8">
          <CardContent className="flex items-center space-x-6">
            <Image
              src={author.imageUrl || "/defaultProfilePic.svg"}
              alt={author.username}
              width={100}
              height={100}
              className="rounded-full object-cover min-w-[100px] min-h-[100px]"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{author.fullname}</h1>
              <p className="text-foreground mb-4">
                Journalist and writer covering various topics including politics, technology, and global affairs.
              </p>
              <div className="text-sm text-muted-foreground">
                {posts.length} article{posts.length !== 1 ? "s" : ""} published
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author's Posts */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Articles by {author.fullname}</h2>
          <div className="flex flex-wrap gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showAuthor={false} last={true} showViews={true} showLikes={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface ArticleListItemProps {
  id: number
  title: string
  createdAt: Date
  thumbnail: string
  last?: boolean
  category: string
}

const ArticleListItem = ({ id, title, createdAt, thumbnail, last, category }: ArticleListItemProps) => {
  const formattedDate = formatDistanceToNow(createdAt);

  return (
    <Link href={`/articles/${id}`} className={cn("block group", last ? "" : "border-b border-separate")}>
      <div className="flex space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex-shrink-0">
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            width={60}
            height={45}
            className="w-[60px] h-[45px] rounded object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight">
            {title}
          </h3>
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <span>{category}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArticleListItem

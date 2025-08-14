export interface User {
  id: string
  name: string
  email: string
  role: "editor" | "moderator" | "admin"
  avatar?: string
}

export interface DashboardStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalPosts: number
  viewsChange: number
  likesChange: number
  commentsChange: number
  postsChange: number
}

export interface ChartData {
  date: string
  views: number
  likes: number
  comments: number
}

export interface TopPost {
  id: string
  title: string
  slug: string
  views: number
  likes: number
  comments: number
  publishedAt: string
  author: string
  category: string
}

export interface AnalyticsFilter {
  dateRange: "7d" | "30d" | "90d" | "custom"
  startDate?: string
  endDate?: string
  category?: string
  postId?: string
  authorId?: string
}

export interface Comment {
  id: string
  postId: string
  postTitle: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  status: "pending" | "approved" | "flagged"
  createdAt: string
  parentId?: string
  replies?: Comment[]
}

export interface PostAnalytics {
  postId: string
  title: string
  slug: string
  author: string
  thumbnail: string
  publishedAt: string
  totalViews: number
  totalLikes: number
  totalComments: number
  chartData: ChartData[]
  topReferrers: Array<{ source: string; views: number }>
  demographics: Array<{ country: string; views: number }>
}

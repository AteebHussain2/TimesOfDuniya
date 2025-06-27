'use server';

import { GetAllPublishedPosts } from "@/actions/site/posts/getAllPublishedPosts";
import { getViewTracker, getLikeTracker } from "@/lib/view-tracking";
import { TypeGetAllPublishedPosts } from "./types";

export type TrendingPost = TypeGetAllPublishedPosts[number] & {
  trendingScore: number
  engagementRate: number
  recentViews: number
}

const posts = await GetAllPublishedPosts();

// Calculate trending score based on recent engagement
export async function calculateTrendingScore(post: TypeGetAllPublishedPosts[number]): Promise<number> {
  if (!post) {
    return 0
  };
  const now = new Date()
  const postDate = new Date(post?.publishedAt!)
  const hoursOld = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)

  // Decay factor - newer posts get higher scores
  const timeFactor = Math.max(0.1, 1 - hoursOld / (24 * 7)) // Decay over a week

  // Engagement metrics
  const viewsWeight = post?.views.length * 0.1
  const likesWeight = post?.likes.length * 2
  const commentsWeight = post.comments.length * 5

  // Calculate engagement rate (likes + comments per view)
  const engagementRate = post?.views.length > 0 ? (post?.likes.length! + post.comments.length) / post?.views.length : 0
  const engagementWeight = engagementRate * 100

  return (viewsWeight + likesWeight + commentsWeight + engagementWeight) * timeFactor
}

// Get trending posts
export async function getTrendingPosts(limit = 6): Promise<TrendingPost[]> {
  const postsWithScores = posts.map(async (post) => {
    const trendingScore = await calculateTrendingScore(post)
    const engagementRate = post?.views.length > 0 ? (post?.likes.length + post.comments.length) / post?.views.length : 0

    return {
      ...post,
      trendingScore,
      engagementRate,
      recentViews: Math.floor(post?.views.length * 0.3), // Simulate recent views
    } as TrendingPost
  })

  const resolvedPosts = await Promise.all(postsWithScores)
  return resolvedPosts.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit)
}

// Get posts similar to current post based on tags and category
export async function getMoreLikeThis(currentPost: TypeGetAllPublishedPosts[number], limit = 4): Promise<TypeGetAllPublishedPosts> {
  const similarPosts = posts
    .filter((post) => post?.id !== currentPost?.id)
    .map((post) => {
      let score = 0

      // Same category gets high score
      if (post?.category === currentPost?.category) {
        score += 10
      }

      // Shared tags get points
      const sharedTags = post?.tags.filter((tag) =>
        currentPost?.tags.some((currentTag) => currentTag.name.toLowerCase() === tag.name.toLowerCase()),
      )
      score += sharedTags.length * 5

      // Same author gets bonus
      if (post?.author.username === currentPost?.author.username) {
        score += 3
      }

      // Recent posts get slight bonus
      const daysDiff =
        Math.abs(new Date(post?.publishedAt!).getTime() - new Date(currentPost?.publishedAt!).getTime()) /
        (1000 * 60 * 60 * 24)
      if (daysDiff < 7) {
        score += 2
      }

      return { post, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)

  return similarPosts
}

// Get personalized suggestions based on user's interaction history
export async function getSuggestedForYou(limit = 4): Promise<TypeGetAllPublishedPosts> {
  if (typeof window === "undefined") {
    // Server-side fallback
    return posts.slice(0, limit)
  }

  const viewTracker = getViewTracker()
  const likeTracker = getLikeTracker()

  // Get user's interaction patterns
  const viewedPosts = posts.filter((post) => viewTracker.hasViewed(post?.id))
  const likedPosts = posts.filter((post) => likeTracker.hasLiked(post?.id))

  // Extract user preferences
  const preferredCategories = new Map<string, number>()
  const preferredTags = new Map<string, number>()
  const preferredAuthors = new Map<string, number>()

  // Weight liked posts more than just viewed posts
  const allInteractedPosts = [
    ...viewedPosts.map((post) => ({ post, weight: 1 })),
    ...likedPosts.map((post) => ({ post, weight: 3 })),
  ]

  allInteractedPosts.forEach(({ post, weight }) => {
    // Track category preferences
    preferredCategories.set(post.category?.name!, (preferredCategories.get(post.category?.name!) || 0) + weight)

    // Track tag preferences
    post?.tags.forEach((tag) => {
      preferredTags.set(tag.name, (preferredTags.get(tag.name) || 0) + weight)
    })

    // Track author preferences
    preferredAuthors.set(post?.author.username, (preferredAuthors.get(post?.author.username) || 0) + weight)
  })

  // Score unviewed posts based on preferences
  const unviewedPosts = posts.filter((post) => !viewTracker.hasViewed(post?.id))

  const scoredPosts = unviewedPosts.map((post) => {
    let score = 0

    // Category preference
    score += preferredCategories.get(post?.category?.name!) || 0

    // Tag preferences
    post?.tags.forEach((tag) => {
      score += preferredTags.get(tag.name) || 0
    })

    // Author preference
    score += preferredAuthors.get(post?.author.username) || 0

    // Boost popular posts slightly
    score += Math.log(post?.views.length + 1) * 0.1
    score += Math.log(post?.likes.length + 1) * 0.2

    return { post, score }
  })

  // If no interaction history, return trending posts
  if (scoredPosts.length === 0 || Math.max(...scoredPosts.map((p) => p.score)) === 0) {
    const trendingPosts = await getTrendingPosts(limit)
    return trendingPosts.map((tp) => tp as TypeGetAllPublishedPosts[number])
  }

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

// Get posts by engagement level
export async function getPopularThisWeek(limit = 6): Promise<TypeGetAllPublishedPosts> {
  return posts
    .filter((post) => {
      const daysSincePublished = (Date.now() - new Date(post?.publishedAt!).getTime()) / (1000 * 60 * 60 * 24)
      return daysSincePublished <= 7
    })
    .sort((a, b) => {
      const aEngagement = a.views.length + a.likes.length * 2 + a.comments.length * 5
      const bEngagement = b.views.length + b.likes.length * 2 + b.comments.length * 5
      return bEngagement - aEngagement
    })
    .slice(0, limit)
}

// Get category-based recommendations
export async function getCategoryRecommendations(category: string, excludeId?: number, limit = 3): Promise<TypeGetAllPublishedPosts> {
  return posts
    .filter((post) => post?.category?.name.toLowerCase() === category.toLowerCase() && post?.id !== excludeId)
    .sort((a, b) => b.views.length - a.views.length)
    .slice(0, limit)
}

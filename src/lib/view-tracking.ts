"use client"

// Simple session-based view tracking (in production, this would be server-side)
class ViewTracker {
  private viewedPosts: Set<number> = new Set()
  private sessionId: string

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId()
    // Load viewed posts from sessionStorage
    this.loadViewedPosts()
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("session_id")
    if (!sessionId) {
      sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("session_id", sessionId)
    }
    return sessionId
  }

  private loadViewedPosts(): void {
    const viewed = sessionStorage.getItem("viewed_posts")
    if (viewed) {
      try {
        const viewedArray = JSON.parse(viewed)
        this.viewedPosts = new Set(viewedArray)
      } catch (e) {
        console.error("Error loading viewed posts:", e)
      }
    }
  }

  private saveViewedPosts(): void {
    sessionStorage.setItem("viewed_posts", JSON.stringify(Array.from(this.viewedPosts)))
  }

  hasViewed(postId: number): boolean {
    return this.viewedPosts.has(postId)
  }

  markAsViewed(postId: number): boolean {
    if (this.viewedPosts.has(postId)) {
      return false // Already viewed
    }

    this.viewedPosts.add(postId)
    this.saveViewedPosts()
    return true // New view
  }

  getSessionId(): string {
    return this.sessionId
  }
}

// Singleton instance
let viewTracker: ViewTracker | null = null

export function getViewTracker(): ViewTracker {
  if (typeof window === "undefined") {
    // Server-side rendering - return a mock
    return {
      hasViewed: () => false,
      markAsViewed: () => true,
      getSessionId: () => "server",
    } as unknown as ViewTracker
  }

  if (!viewTracker) {
    viewTracker = new ViewTracker()
  }
  return viewTracker
}

// Post likes tracking (session-based for demo)
class LikeTracker {
  private likedPosts: Set<number> = new Set()

  constructor() {
    this.loadLikedPosts()
  }

  private loadLikedPosts(): void {
    if (typeof window === "undefined") return

    const liked = localStorage.getItem("liked_posts")
    if (liked) {
      try {
        const likedArray = JSON.parse(liked)
        this.likedPosts = new Set(likedArray)
      } catch (e) {
        console.error("Error loading liked posts:", e)
      }
    }
  }

  private saveLikedPosts(): void {
    if (typeof window === "undefined") return
    localStorage.setItem("liked_posts", JSON.stringify(Array.from(this.likedPosts)))
  }

  hasLiked(postId: number): boolean {
    return this.likedPosts.has(postId)
  }

  toggleLike(postId: number): boolean {
    const wasLiked = this.likedPosts.has(postId)

    if (wasLiked) {
      this.likedPosts.delete(postId)
    } else {
      this.likedPosts.add(postId)
    }

    this.saveLikedPosts()
    return !wasLiked // Return new like state
  }
}

let likeTracker: LikeTracker | null = null

export function getLikeTracker(): LikeTracker {
  if (typeof window === "undefined") {
    return {
      hasLiked: () => false,
      toggleLike: () => true,
    } as unknown as LikeTracker
  }

  if (!likeTracker) {
    likeTracker = new LikeTracker()
  }
  return likeTracker
}

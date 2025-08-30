"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"

interface QuotaState {
  used: number
  limit: number
  remaining: number
}

export function useAiQuota() {
  const { isSignedIn } = useAuth()

  // Default: 3 free generations for guests
  const [quota, setQuota] = useState<QuotaState>({
    used: 0,
    limit: 3,
    remaining: 3,
  })

  // Load quota for guests from cookie
  useEffect(() => {
    if (isSignedIn) return // signed-in users = unlimited → no need for quota cookies

    const quotaCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tod_ai_quota="))

    if (quotaCookie) {
      const used = Number.parseInt(quotaCookie.split("=")[1]) || 0
      setQuota({
        used,
        limit: 3,
        remaining: Math.max(0, 3 - used),
      })
    }
  }, [isSignedIn])

  // Decrement for guests only
  const decrementRequests = useCallback(() => {
    if (isSignedIn) return // Unlimited usage for signed-in users

    const newUsed = quota.used + 1
    const newRemaining = Math.max(0, quota.limit - newUsed)

    setQuota({
      used: newUsed,
      limit: quota.limit,
      remaining: newRemaining,
    })

    // Update cookie (30-day expiry)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    document.cookie = `tod_ai_quota=${newUsed}; expires=${expiryDate.toUTCString()}; path=/`
  }, [isSignedIn, quota])

  const canMakeRequest = useCallback(() => {
    return isSignedIn || quota.remaining > 0
  }, [isSignedIn, quota])

  return {
    quota,
    isSignedIn,
    remainingRequests: isSignedIn ? Infinity : quota.remaining,
    canMakeRequest,
    decrementRequests,
    // Legacy support
    canGenerate: canMakeRequest(),
    consumeQuota: decrementRequests,
  }
}

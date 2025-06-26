"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@imagekit/next";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  aspectRatio?: "video" | "square" | "portrait"
  priority?: boolean
}

export function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  aspectRatio = "video",
  priority = false,
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (fill) {
    return (
      <div className={cn("relative overflow-hidden", aspectClasses[aspectRatio], className)}>
        {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        ) : (
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className={cn("object-cover transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0" style={{ width: width || "100%", height: height || "auto" }} />
      )}
      {hasError ? (
        <div
          className="flex items-center justify-center bg-muted text-muted-foreground"
          style={{ width: width || "100%", height: height || "200px" }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      ) : (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
        />
      )}
    </div>
  )
}

// Named export for consistency

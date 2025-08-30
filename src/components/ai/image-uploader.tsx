"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ImageIcon, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
  onUpload: (url: string) => void
  onClose: () => void
}

export function ImageUploader({ onUpload, onClose }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      processFile(imageFile)
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file (PNG, JPG, GIF, WebP).",
        variant: "destructive",
      })
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    } else if (file) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, GIF, WebP).",
        variant: "destructive",
      })
    }
  }

  const processFile = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !preview) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate upload to ImageKit/Cloudinary
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUploadProgress(100)

      // In a real implementation, this would be the URL from ImageKit/Cloudinary
      const mockUrl = URL.createObjectURL(selectedFile)

      toast({
        title: "Upload Successful",
        description: "Image uploaded successfully!",
      })

      setTimeout(() => {
        onUpload(mockUrl)
      }, 500)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upload Thumbnail Image</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-primary bg-primary/10 scale-105"
                : preview
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-muted hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  {uploadProgress === 100 && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPreview(null)
                      setSelectedFile(null)
                      setUploadProgress(0)
                    }}
                    disabled={isUploading}
                  >
                    Choose Different
                  </Button>
                  <Button onClick={handleUpload} disabled={isUploading || uploadProgress === 100} className="flex-1">
                    {isUploading ? "Uploading..." : uploadProgress === 100 ? "Uploaded!" : "Upload Image"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drop your image here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  <p className="text-xs text-muted-foreground mt-2">Supports PNG, JPG, GIF, WebP (max 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                <Button variant="outline" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Choose File
                  </label>
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              💡 <strong>Tips for better thumbnails:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Use high-quality images (at least 1200x630px)</li>
              <li>Ensure good contrast and readability</li>
              <li>Avoid cluttered or busy backgrounds</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

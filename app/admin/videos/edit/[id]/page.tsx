"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Video } from "@/lib/store"

export default function EditVideo() {
  const { videos, updateVideo } = useStore()
  const router = useRouter()
  const { toast } = useToast()
  // Use the useParams hook instead of receiving params as a prop
  const params = useParams()
  const videoId = params.id as string

  const [formData, setFormData] = useState<Video | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run this effect once on component mount
    if (isLoading) {
      const videoId = params.id as string
      const video = videos.find((v) => v.id === videoId)
      if (video) {
        setFormData({ ...video })
      } else {
        toast({
          title: "Video not found",
          description: "The requested video could not be found.",
        })
        router.push("/admin/videos")
      }
      setIsLoading(false)
    }
  }, [isLoading, videos, router, toast, params])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (value: string) => {
    if (!formData) return

    setFormData({ ...formData, category: value })

    // Clear error when user selects
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.category
        return newErrors
      })
    }
  }

  const validateForm = () => {
    if (!formData) return false

    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.youtubeId.trim()) {
      newErrors.youtubeId = "YouTube ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData || !validateForm()) {
      return
    }

    // Add this right before the updateVideo call
    console.log("Updating video:", videoId, formData)

    // Update the video with all fields from formData
    updateVideo(videoId, {
      title: formData.title,
      description: formData.description,
      youtubeId: formData.youtubeId,
      // Keep other fields unchanged
      category: formData.category,
      date: formData.date,
    })

    toast({
      title: "Video updated",
      description: "The video has been successfully updated.",
    })

    // Redirect back to the videos list
    router.push("/admin/videos")
  }

  if (isLoading || !formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Video</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Video Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter video description"
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

          

            <div className="space-y-2">
              <Label htmlFor="youtubeId">YouTube ID</Label>
              <Input
                id="youtubeId"
                name="youtubeId"
                value={formData.youtubeId}
                onChange={handleChange}
                placeholder="e.g. dQw4w9WgXcQ"
                className={errors.youtubeId ? "border-destructive" : ""}
              />
              {errors.youtubeId && <p className="text-sm text-destructive">{errors.youtubeId}</p>}
              <p className="text-xs text-muted-foreground">
                The YouTube ID is the part after "v=" in the YouTube URL. For example, in
                https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/videos">Cancel</Link>
            </Button>
            <Button type="submit">Update Video</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

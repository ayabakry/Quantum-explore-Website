"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewVideo() {
  const { addVideo, videos } = useStore()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.youtubeId.trim()) {
      newErrors.youtubeId = "YouTube ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = (Math.max(...videos.map((v) => Number.parseInt(v.id)), 0) + 1).toString()

    // Add the new video
    addVideo({
      id: newId,
      title: formData.title,
      description: formData.description,
      category: "uncategorized", // Default category
      youtubeId: formData.youtubeId,
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    })

    toast({
      title: "Video added",
      description: "The video has been successfully added.",
    })

    // Redirect back to the videos list
    router.push("/admin/videos")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/videos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Video</h1>
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
            <Button type="submit">Add Video</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

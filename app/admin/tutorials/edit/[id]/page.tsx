"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Tutorial } from "@/lib/store"

export default function EditTutorial({ params }: { params: { id: string } }) {
  const { tutorials, updateTutorial } = useStore()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Tutorial | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tutorial = tutorials.find((t) => t.id === params.id)
    if (tutorial) {
      setFormData(tutorial)
    } else {
      toast({
        title: "Tutorial not found",
        description: "The requested tutorial could not be found.",
      })
      router.push("/admin/tutorials")
    }
    setIsLoading(false)
  }, [params.id, tutorials, router, toast])

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

  const handleSelectChange = (field: string, value: string) => {
    if (!formData) return

    setFormData({ ...formData, [field]: value })

    // Clear error when user selects
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
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

    if (!formData.type) {
      newErrors.type = "File type is required"
    }

    if (!formData.fileSize.trim()) {
      newErrors.fileSize = "File size is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData || !validateForm()) {
      return
    }

    // Update the tutorial
    updateTutorial(params.id, formData)

    toast({
      title: "Tutorial updated",
      description: "The tutorial has been successfully updated.",
    })

    // Redirect back to the tutorials list
    router.push("/admin/tutorials")
  }

  if (isLoading || !formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tutorials">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Tutorial</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Tutorial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter tutorial title"
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
                placeholder="Enter tutorial description"
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">File Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="ppt">PPT</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileSize">File Size</Label>
                <Input
                  id="fileSize"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleChange}
                  placeholder="e.g. 2.4 MB"
                  className={errors.fileSize ? "border-destructive" : ""}
                />
                {errors.fileSize && <p className="text-sm text-destructive">{errors.fileSize}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* In a real app, you would add a file upload component here */}
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                Current file: {formData.type.toUpperCase()} ({formData.fileSize})
              </p>
              <p className="text-muted-foreground mt-2">File upload would be implemented here in a production app</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/tutorials">Cancel</Link>
            </Button>
            <Button type="submit">Update Tutorial</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

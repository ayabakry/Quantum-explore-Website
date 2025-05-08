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
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import type { Patent } from "@/lib/store"

export default function EditPatent({ params }: { params: { id: string } }) {
  const { patents, updatePatent } = useStore()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<Patent | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const patent = patents.find((p) => p.id === params.id)
    if (patent) {
      setFormData(patent)
    } else {
      toast({
        title: "Patent not found",
        description: "The requested patent could not be found.",
      })
      router.push("/admin/patents")
    }
    setIsLoading(false)
  }, [params.id, patents, router, toast])

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

    setFormData({ ...formData, status: value })

    // Clear error when user selects
    if (errors.status) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.status
        return newErrors
      })
    }
  }

  const handleInventorChange = (index: number, value: string) => {
    if (!formData) return

    const newInventors = [...formData.inventors]
    newInventors[index] = value
    setFormData({ ...formData, inventors: newInventors })
  }

  const addInventor = () => {
    if (!formData) return

    setFormData({ ...formData, inventors: [...formData.inventors, ""] })
  }

  const removeInventor = (index: number) => {
    if (!formData || formData.inventors.length <= 1) return

    const newInventors = [...formData.inventors]
    newInventors.splice(index, 1)
    setFormData({ ...formData, inventors: newInventors })
  }

  const validateForm = () => {
    if (!formData) return false

    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.abstract.trim()) {
      newErrors.abstract = "Abstract is required"
    }

    if (formData.inventors.some((inventor) => !inventor.trim())) {
      newErrors.inventors = "All inventor fields must be filled"
    }

    if (!formData.filingDate.trim()) {
      newErrors.filingDate = "Filing date is required"
    }

    if (!formData.status) {
      newErrors.status = "Status is required"
    }

    // Issue date is only required if status is "Granted"
    if (formData.status === "Granted" && !formData.issueDate) {
      newErrors.issueDate = "Issue date is required for granted patents"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData || !validateForm()) {
      return
    }

    // Update the patent
    updatePatent(params.id, {
      ...formData,
      inventors: formData.inventors.filter((inventor) => inventor.trim()),
      issueDate: formData.status === "Granted" ? formData.issueDate : null,
    })

    toast({
      title: "Patent updated",
      description: "The patent has been successfully updated.",
    })

    // Redirect back to the patents list
    router.push("/admin/patents")
  }

  if (isLoading || !formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/patents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Patent</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Patent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">Patent ID</Label>
              <Input id="id" name="id" value={formData.id} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Patent ID cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter patent title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                placeholder="Enter patent abstract"
                className={errors.abstract ? "border-destructive" : ""}
                rows={4}
              />
              {errors.abstract && <p className="text-sm text-destructive">{errors.abstract}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Inventors</Label>
                <Button type="button" variant="outline" size="sm" onClick={addInventor}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Inventor
                </Button>
              </div>
              {formData.inventors.map((inventor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={inventor}
                    onChange={(e) => handleInventorChange(index, e.target.value)}
                    placeholder={`Inventor ${index + 1}`}
                    className={errors.inventors ? "border-destructive" : ""}
                  />
                  {formData.inventors.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeInventor(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.inventors && <p className="text-sm text-destructive">{errors.inventors}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filingDate">Filing Date</Label>
                <Input
                  id="filingDate"
                  name="filingDate"
                  type="date"
                  value={formData.filingDate}
                  onChange={handleChange}
                  className={errors.filingDate ? "border-destructive" : ""}
                />
                {errors.filingDate && <p className="text-sm text-destructive">{errors.filingDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger id="status" className={errors.status ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Granted">Granted</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
              </div>
            </div>

            {formData.status === "Granted" && (
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate || ""}
                  onChange={handleChange}
                  className={errors.issueDate ? "border-destructive" : ""}
                />
                {errors.issueDate && <p className="text-sm text-destructive">{errors.issueDate}</p>}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/patents">Cancel</Link>
            </Button>
            <Button type="submit">Update Patent</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

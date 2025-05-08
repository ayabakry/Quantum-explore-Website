"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Search, FileIcon as FilePresentation, Download } from "lucide-react"
import { useStore } from "@/lib/store"

export default function TutorialsPage() {
  const { tutorials } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === "all" || tutorial.category === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8 px-4 md:px-8 md:py-12 mx-auto">
      <div className="space-y-6 flex flex-col items-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Tutorials</h1>
          <p className="text-muted-foreground mt-2">
            Download educational materials about quantum computing and QRAM technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tutorials..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="w-full max-w-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={tutorial.type === "pdf" ? "default" : "default"}>
                      {tutorial.type === "pdf" ? (
                        <FileText className="mr-1 h-3 w-3" />
                      ) : (
                        <FilePresentation className="mr-1 h-3 w-3" />
                      )}
                      {tutorial.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{tutorial.fileSize}</span>
                  </div>
                  <CardTitle className="mt-2 text-secondary text-xl text-center">{tutorial.title}</CardTitle>
                  <CardDescription className="text-center">{tutorial.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Published: {new Date(tutorial.date).toLocaleDateString()}
                  </span>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No tutorials found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

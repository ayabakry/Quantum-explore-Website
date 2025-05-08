"use client"

import { useState } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useStore } from "@/lib/store"

export default function VideosPage() {
  const { videos } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === "all" || video.category === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8 px-4 md:px-8 md:py-12 mx-auto">
      <div className="space-y-6 flex flex-col items-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Video Library</h1>
          <p className="text-muted-foreground mt-2">
            Explore our collection of educational videos about quantum computing and QRAM technology.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden w-full max-w-sm">
                <div className="aspect-video w-full">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <CardHeader>
                  <CardTitle className="text-secondary text-center">{video.title}</CardTitle>
                  <CardDescription className="text-center">{video.description}</CardDescription>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground justify-center">
                  Published: {new Date(video.date).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No videos found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

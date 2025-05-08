"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminVideos() {
  const { videos, deleteVideo } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      deleteVideo(id)
      toast({
        title: "Video deleted",
        description: "The video has been successfully deleted.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Videos</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove videos from the website.</p>
        </div>
        <Button asChild>
          <Link href="/admin/videos/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Videos</CardTitle>
          <div className="relative mt-2 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search videos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">
                      <div>
                        {video.title}
                        {/* <p className="text-sm text-muted-foreground md:hidden">{video.category}</p> */}
                      </div>
                    </TableCell>
                   
                    <TableCell className="hidden md:table-cell">{new Date(video.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/videos/edit/${video.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No videos found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

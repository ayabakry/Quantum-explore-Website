"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, FileText, FileIcon as FilePresentation, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function AdminTutorials() {
  const { tutorials, deleteTutorial } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this tutorial?")) {
      deleteTutorial(id)
      toast({
        title: "Tutorial deleted",
        description: "The tutorial has been successfully deleted.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Tutorials</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove tutorials from the website.</p>
        </div>
        <Button asChild>
          <Link href="/admin/tutorials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tutorial
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tutorials</CardTitle>
          <div className="relative mt-2 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tutorials..."
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
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutorials.length > 0 ? (
                filteredTutorials.map((tutorial) => (
                  <TableRow key={tutorial.id}>
                    <TableCell className="font-medium">
                      <div>
                        {tutorial.title}
                        <div className="flex items-center gap-2 md:hidden">
                          <Badge variant={tutorial.type === "pdf" ? "default" : "secondary"} className="mt-1">
                            {tutorial.type === "pdf" ? (
                              <FileText className="mr-1 h-3 w-3" />
                            ) : (
                              <FilePresentation className="mr-1 h-3 w-3" />
                            )}
                            {tutorial.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="mt-1">
                            {tutorial.category}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={tutorial.type === "pdf" ? "default" : "secondary"}>
                        {tutorial.type === "pdf" ? (
                          <FileText className="mr-1 h-3 w-3" />
                        ) : (
                          <FilePresentation className="mr-1 h-3 w-3" />
                        )}
                        {tutorial.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{tutorial.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(tutorial.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/tutorials/edit/${tutorial.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tutorial.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No tutorials found.
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

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
import { useToast } from "@/hooks/use-toast"

export default function AdminPatents() {
  const { patents, deletePatent } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredPatents = patents.filter(
    (patent) =>
      patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patent.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patent.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patent?")) {
      deletePatent(id)
      toast({
        title: "Patent deleted",
        description: "The patent has been successfully deleted.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Patents</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove patents from the website.</p>
        </div>
        <Button asChild>
          <Link href="/admin/patents/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Patent
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Patents</CardTitle>
          <div className="relative mt-2 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patents..."
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
                <TableHead>Patent ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Filing Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatents.length > 0 ? (
                filteredPatents.map((patent) => (
                  <TableRow key={patent.id}>
                    <TableCell className="font-medium">{patent.id}</TableCell>
                    <TableCell>
                      <div>
                        {patent.title}
                        <div className="md:hidden mt-1">
                          <Badge variant={patent.status === "Granted" ? "default" : "outline"}>{patent.status}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={patent.status === "Granted" ? "default" : "outline"}>{patent.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(patent.filingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/patents/edit/${patent.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(patent.id)}>
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
                    No patents found.
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

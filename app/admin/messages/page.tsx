"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Sample contact messages
const initialMessages = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Research Collaboration",
    message:
      "I'm interested in collaborating on quantum computing research with your team. We have developed a new algorithm that might be compatible with your QRAM architecture.",
    date: "2023-11-05T14:23:00Z",
    read: true,
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    subject: "Technical Support",
    message:
      "I'm having trouble understanding how to implement your QRAM architecture in my project. Could you provide some guidance or documentation?",
    date: "2023-11-10T09:45:00Z",
    read: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    subject: "Partnership Opportunity",
    message:
      "Our company is developing quantum computing hardware and we're interested in exploring a partnership with your team to integrate our hardware with your QRAM technology.",
    date: "2023-11-12T16:30:00Z",
    read: false,
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    subject: "General Inquiry",
    message:
      "I'm a student working on a thesis about quantum memory architectures. I would like to know if you have any public research papers or resources I could reference.",
    date: "2023-11-15T11:20:00Z",
    read: true,
  },
  {
    id: "5",
    name: "David Rodriguez",
    email: "david.rodriguez@example.com",
    subject: "Technical Support",
    message:
      "I'm experiencing issues with the quantum coherence in my implementation based on your architecture. Could your team provide some troubleshooting assistance?",
    date: "2023-11-18T13:15:00Z",
    read: false,
  },
]

export default function AdminMessages() {
  const [messages, setMessages] = useState(initialMessages)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setMessages(messages.filter((message) => message.id !== id))
    }
  }

  const markAsRead = (id: string) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, read: true } : message)))
  }

  const unreadCount = messages.filter((message) => !message.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground mt-2">
            Manage contact form submissions.{" "}
            {unreadCount > 0 && `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}.`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Messages</CardTitle>
          <div className="relative mt-2 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
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
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow key={message.id} className={!message.read ? "bg-muted/30" : undefined}>
                    <TableCell className="font-medium">
                      <div>
                        {message.name}
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!message.read && <Badge className="h-2 w-2 rounded-full p-0 bg-primary" />}
                        {message.subject}
                        <p className="text-sm text-muted-foreground md:hidden">
                          {new Date(message.date).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(message.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild onClick={() => markAsRead(message.id)}>
                          <Link href={`/admin/messages/${message.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
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
                    No messages found.
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

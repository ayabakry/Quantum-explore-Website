import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/sidebar"

// Simple admin authentication check
// In a real app, you would use a proper auth system
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // This is a client-side only check for demo purposes
  // In a real app, you would use server-side authentication
  const isAuthenticated = true // Replace with actual auth check

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}

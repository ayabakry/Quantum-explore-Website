"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Activity, FileText, Film, Home, LogOut, Mail, Settings, User } from "lucide-react"
import Image from "next/image"

const navigation = [
  // { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Videos", href: "/admin/videos", icon: Film },
  { name: "Tutorials", href: "/admin/tutorials", icon: FileText },
  { name: "Patents", href: "/admin/patents", icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/40">
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === item.href ? "bg-muted text-primary font-medium" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@qram.tech</p>
          </div>
        </div>
        <Link
          href="/"
          className="mt-2 flex w-full items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm hover:bg-muted/80"
        >
          <LogOut className="h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </div>
  )
}

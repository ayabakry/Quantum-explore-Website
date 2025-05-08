import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-8 py-8 md:py-12">
       
        <div className="mt-8  pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} QRAM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

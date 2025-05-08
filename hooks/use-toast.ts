"use client"

// Simplified toast hook for the example
import { useState } from "react"

type ToastProps = {
  title: string
  description: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description }: ToastProps) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { title, description }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast !== { title, description }))
    }, 5000)
  }

  return { toast, toasts }
}

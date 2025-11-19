"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

interface NotificationsBadgeProps {
  className?: string
}

export function NotificationsBadge({ className }: NotificationsBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const orders = localStorage.getItem("mock-orders")
    if (orders) {
      try {
        const parsed = JSON.parse(orders)
        const unread = parsed.filter((o: any) => o.status === "pending").length
        setUnreadCount(unread)
      } catch {
        setUnreadCount(3) // Default mock value
      }
    } else {
      setUnreadCount(3) // Demo default
    }
  }, [])

  return (
    <div className={`relative ${className || ""}`}>
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  )
}

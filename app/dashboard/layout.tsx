"use client"

import type React from "react"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, Home, ShoppingCart, BarChart3, MessageSquare, Settings, LogOut, Bell, Search } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(3)
  const searchParams = useSearchParams()

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-card border-r border-border">
        <div className="p-6 flex items-center gap-3 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">FarmerHub</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink href="/dashboard" icon={Home} label="Dashboard" />
          <NavLink href="/dashboard/products" icon={ShoppingCart} label="Products" />
          <NavLink href="/dashboard/orders" icon={BarChart3} label="Orders" />
          <NavLink href="/dashboard/messages" icon={MessageSquare} label="Messages" badge={2} />
          <NavLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
          <NavLink href="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-border">
          <Button size="sm" variant="outline" onClick={handleLogout} className="w-full bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1 hidden sm:block">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search products, orders..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">U</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  badge?: number
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors group relative"
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
      {badge && (
        <span className="absolute right-4 w-5 h-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

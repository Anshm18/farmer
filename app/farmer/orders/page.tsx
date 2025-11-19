"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Order {
  _id: string
  productId: string
  quantity: number
  totalPrice: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  vendorId: string
  createdAt: string
}

export default function FarmerOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "1",
      productId: "1",
      quantity: 10,
      totalPrice: 25.0,
      status: "pending",
      vendorId: "v1",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "2",
      productId: "2",
      quantity: 5,
      totalPrice: 7.5,
      status: "confirmed",
      vendorId: "v2",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: "3",
      productId: "3",
      quantity: 3,
      totalPrice: 12.0,
      status: "shipped",
      vendorId: "v1",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      localStorage.setItem("user", JSON.stringify({ name: "Demo Farmer", role: "farmer" }))
      localStorage.setItem("token", "demo-token-" + Date.now())
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "farmer") {
      router.push("/vendor/marketplace")
      return
    }
  }, [router])

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    setTimeout(() => {
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus as any } : order)))
      setUpdating(null)
    }, 500)
  }

  const getNextStatuses = (currentStatus: string): string[] => {
    const statusFlow: { [key: string]: string[] } = {
      pending: ["confirmed", "declined"],
      confirmed: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
    }
    return statusFlow[currentStatus] || []
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-secondary/10 text-secondary",
      confirmed: "bg-primary/10 text-primary",
      shipped: "bg-accent/10 text-accent",
      delivered: "bg-primary/10 text-primary",
      declined: "bg-destructive/10 text-destructive",
    }
    return colors[status] || "bg-muted/10 text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Incoming Orders</h1>
          <Button variant="outline" onClick={() => router.push("/farmer/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-lg text-muted-foreground">No orders yet</p>
              <p className="text-sm text-muted-foreground mt-2">Orders from vendors will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const nextStatuses = getNextStatuses(order.status)
              return (
                <Card key={order._id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">Order #{order._id}</h3>
                          <span
                            className={`px-3 py-1 rounded-full font-medium text-xs ${getStatusColor(order.status)}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity} units • ${order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      {nextStatuses.length > 0 && (
                        <div className="flex gap-2 flex-wrap justify-end">
                          {nextStatuses.map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={status === "declined" ? "outline" : "default"}
                              onClick={() => updateOrderStatus(order._id, status)}
                              disabled={updating === order._id}
                            >
                              {status === "declined" ? "Decline" : `Mark ${status}`}
                            </Button>
                          ))}
                        </div>
                      )}

                      {nextStatuses.length === 0 && order.status === "delivered" && (
                        <div className="text-sm font-medium text-primary">Completed</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

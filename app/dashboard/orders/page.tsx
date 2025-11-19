"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import type React from "react"
import { Package, Truck, CheckCircle2, AlertCircle } from "lucide-react"

interface Order {
  id: string
  items: string
  buyer: string
  date: string
  status: "pending" | "confirmed" | "shipped" | "delivered"
  amount: number
  buyerEmail?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState({ email: "" })

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedOrders = localStorage.getItem("orders")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const getUserOrders = () => {
    return orders.filter((order) => order.buyerEmail === user.email)
  }

  const displayOrders = getUserOrders()

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      pending: AlertCircle,
      confirmed: CheckCircle2,
      shipped: Truck,
      delivered: CheckCircle2,
    }
    return icons[status] || Package
  }

  const statusCounts = {
    pending: displayOrders.filter((o) => o.status === "pending").length,
    confirmed: displayOrders.filter((o) => o.status === "confirmed").length,
    shipped: displayOrders.filter((o) => o.status === "shipped").length,
    delivered: displayOrders.filter((o) => o.status === "delivered").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage and track all your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
          <div className="text-2xl font-bold text-foreground">{statusCounts.pending}</div>
          <p className="text-sm text-muted-foreground">Pending</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CheckCircle2 className="w-8 h-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-foreground">{statusCounts.confirmed}</div>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <Truck className="w-8 h-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-foreground">{statusCounts.shipped}</div>
          <p className="text-sm text-muted-foreground">Shipped</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-foreground">{statusCounts.delivered}</div>
          <p className="text-sm text-muted-foreground">Delivered</p>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/50">
        {displayOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status)
                  return (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{order.items}</td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">₹{order.amount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground">No orders yet. Start shopping to create an order!</p>
          </div>
        )}
      </Card>
    </div>
  )
}

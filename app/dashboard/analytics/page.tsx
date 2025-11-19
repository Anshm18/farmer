"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Calendar, Users, Package } from "lucide-react"

export default function AnalyticsPage() {
  const monthlyData = [
    { month: "Jan", sales: 4000, orders: 24 },
    { month: "Feb", sales: 3000, orders: 21 },
    { month: "Mar", sales: 2000, orders: 16 },
    { month: "Apr", sales: 2780, orders: 19 },
    { month: "May", sales: 1890, orders: 14 },
    { month: "Jun", sales: 2390, orders: 18 },
  ]

  const maxSales = Math.max(...monthlyData.map((d) => d.sales))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            This Month
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <TrendingUp className="w-8 h-8 text-primary mb-2" />
          <div className="text-2xl font-bold text-foreground">₹48,500</div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
          <span className="text-xs text-green-600 font-semibold mt-2 inline-block">+12% vs last month</span>
        </Card>
        <Card className="p-6">
          <Package className="w-8 h-8 text-accent mb-2" />
          <div className="text-2xl font-bold text-foreground">152</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
          <span className="text-xs text-green-600 font-semibold mt-2 inline-block">+8% vs last month</span>
        </Card>
        <Card className="p-6">
          <Users className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">4.8</div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
          <span className="text-xs text-blue-600 font-semibold mt-2 inline-block">24 reviews</span>
        </Card>
        <Card className="p-6">
          <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
          <div className="text-2xl font-bold text-foreground">1,240</div>
          <div className="text-sm text-muted-foreground">Total Units Sold</div>
          <span className="text-xs text-amber-600 font-semibold mt-2 inline-block">42 avg per order</span>
        </Card>
      </div>

      {/* Simple Bar Chart for Sales Trend */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-6">Sales Trend - Last 6 Months</h3>
        <div className="space-y-4">
          {monthlyData.map((item) => (
            <div key={item.month}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{item.month}</span>
                <span className="text-sm text-muted-foreground">₹{item.sales.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all"
                  style={{ width: `${(item.sales / maxSales) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Orders Overview Table */}
      <Card className="p-6">
        <h3 className="font-bold text-foreground mb-6">Orders Overview - Last 6 Months</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Month</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Orders</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item) => (
                <tr key={item.month} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-foreground">{item.month}</td>
                  <td className="py-3 px-4 text-foreground font-semibold">{item.orders}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-full rounded-full"
                          style={{ width: `${(item.orders / 24) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{Math.round((item.orders / 24) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

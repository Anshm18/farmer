"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NotificationsBadge } from "@/components/notifications-badge"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  description?: string
}

export default function FarmerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Organic Tomatoes",
      price: 2.5,
      quantity: 50,
      category: "Vegetables",
      description: "Fresh, ripe tomatoes",
    },
    {
      id: "2",
      name: "Farm Fresh Lettuce",
      price: 1.5,
      quantity: 30,
      category: "Vegetables",
      description: "Crispy green lettuce",
    },
    {
      id: "3",
      name: "Strawberries",
      price: 4.0,
      quantity: 20,
      category: "Fruits",
      description: "Sweet, juicy strawberries",
    },
  ])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "vegetables",
  })

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userStr || !token) {
      setUser({ name: "Demo Farmer", role: "farmer", email: "farmer@demo.com" })
      localStorage.setItem("user", JSON.stringify({ name: "Demo Farmer", role: "farmer", email: "farmer@demo.com" }))
      localStorage.setItem("token", "demo-token-" + Date.now())
      setLoading(false)
      return
    }

    const userData = JSON.parse(userStr)
    setUser(userData)
    if (userData.role !== "farmer") {
      router.push("/vendor/marketplace")
      return
    }

    setLoading(false)
  }, [router])

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) return

    const product: Product = {
      id: String(Date.now()),
      name: newProduct.name,
      price: Number.parseFloat(newProduct.price),
      quantity: Number.parseInt(newProduct.quantity),
      category: newProduct.category,
      description: newProduct.description,
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "vegetables",
    })
    setShowAddForm(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-muted-foreground">{user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/farmer/orders" className="relative">
              <NotificationsBadge />
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-primary">{products.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Quantity</p>
                  <p className="text-3xl font-bold text-secondary">
                    {products.reduce((sum, p) => sum + p.quantity, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/farmer/orders" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    View Incoming Orders
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>Manage and list your produce</CardDescription>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "+ Add Product"}</Button>
              </CardHeader>
              <CardContent>
                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="mb-6 p-4 bg-background rounded-lg border border-border">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Product Name</label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="e.g., Fresh Tomatoes"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Input
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Describe your product"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Price (per unit)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Quantity</label>
                          <Input
                            type="number"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Add Product
                      </Button>
                    </div>
                  </form>
                )}

                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No products yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Add your first product to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 border border-border rounded-lg flex items-center justify-between hover:bg-background/50"
                      >
                        <div>
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${product.price} • {product.quantity} units
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

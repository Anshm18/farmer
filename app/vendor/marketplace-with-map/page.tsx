"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LocationMap } from "@/components/location-map"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
  location?: { coordinates: [number, number] }
  farmerId: string
}

export default function VendorMarketplaceWithMap() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchRadius, setSearchRadius] = useState("10000") // 10km default
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderQuantity, setOrderQuantity] = useState(1)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userStr || !token) {
      router.push("/login?role=vendor")
      return
    }

    const userData = JSON.parse(userStr)
    setUser(userData)
    if (userData.role !== "vendor") {
      router.push("/farmer/dashboard")
      return
    }

    setLoading(false)
  }, [router])

  const handleLocationSelect = async (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon })
    try {
      const response = await fetch(`/api/products?lat=${lat}&lon=${lon}&radius=${searchRadius}`)
      const data = await response.json()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])
    } catch (err) {
      console.error("[v0] Error fetching nearby products:", err)
    }
  }

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radius = e.target.value
    setSearchRadius(radius)
    if (selectedLocation) {
      handleLocationSelect(selectedLocation.lat, selectedLocation.lon)
    }
  }

  const confirmOrder = async () => {
    if (!selectedProduct) return
    if (orderQuantity > selectedProduct.quantity) {
      alert("Insufficient quantity available")
      return
    }

    const token = localStorage.getItem("token")

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          quantity: orderQuantity,
        }),
      })

      if (response.ok) {
        alert("Order placed successfully!")
        setSelectedProduct(null)
        handleLocationSelect(selectedLocation?.lat || 0, selectedLocation?.lon || 0)
      } else {
        alert("Failed to place order")
      }
    } catch (err) {
      console.error("[v0] Error placing order:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const markerLocations = products.map((p) => ({
    lat: p.location?.coordinates[1] || 0,
    lon: p.location?.coordinates[0] || 0,
    title: p.name,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Marketplace Map</h1>
            <p className="text-muted-foreground">{user.name}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/vendor/marketplace")}>
              List View
            </Button>
            <Button variant="outline" onClick={() => router.push("/vendor/orders")}>
              My Orders
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <LocationMap onLocationSelect={handleLocationSelect} showSearch={true} markerLocations={markerLocations} />

            <div className="mt-4 p-4 bg-card rounded-lg border border-border">
              <label className="text-sm font-medium mb-2 block">Search Radius (meters)</label>
              <Input
                type="number"
                min="1000"
                max="50000"
                step="1000"
                value={searchRadius}
                onChange={handleRadiusChange}
                placeholder="10000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Showing {filteredProducts.length} products
                {selectedLocation && (
                  <>
                    {" "}
                    near {selectedLocation.lat.toFixed(2)}, {selectedLocation.lon.toFixed(2)}
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nearby Products</CardTitle>
                <CardDescription>{filteredProducts.length} products found</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products found. Try adjusting your search radius.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredProducts.slice(0, 10).map((product) => (
                      <div
                        key={product._id}
                        className="p-3 border border-border rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedProduct(product)
                          setOrderQuantity(1)
                        }}
                      >
                        <h4 className="font-semibold text-sm text-foreground">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">${product.price}</p>
                        <p className="text-xs text-primary font-medium mt-1">{product.quantity} available</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{selectedProduct.name}</CardTitle>
                <CardDescription>{selectedProduct.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price per unit</p>
                  <p className="text-3xl font-bold text-primary">${selectedProduct.price}</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}>
                      -
                    </Button>
                    <Input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) =>
                        setOrderQuantity(
                          Math.min(selectedProduct.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)),
                        )
                      }
                      className="flex-1 text-center"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setOrderQuantity(Math.min(selectedProduct.quantity, orderQuantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(selectedProduct.price * orderQuantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedProduct(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={confirmOrder} className="flex-1">
                      Confirm
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

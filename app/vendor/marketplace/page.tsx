"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, X } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  description: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function VendorMarketplace() {
  const [products] = useState<Product[]>([
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
    {
      id: "4",
      name: "Carrots",
      price: 1.2,
      quantity: 100,
      category: "Vegetables",
      description: "Orange, crunchy carrots",
    },
    { id: "5", name: "Apples", price: 3.0, quantity: 40, category: "Fruits", description: "Crisp red apples" },
    {
      id: "6",
      name: "Bell Peppers",
      price: 2.0,
      quantity: 35,
      category: "Vegetables",
      description: "Colorful bell peppers",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderQuantity, setOrderQuantity] = useState(1)

  const categories = ["all", ...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setOrderQuantity(1)
  }

  const confirmOrder = () => {
    if (!selectedProduct) return
    if (orderQuantity > selectedProduct.quantity) {
      alert("Insufficient quantity available")
      return
    }

    const existingItem = cart.find((item) => item.product.id === selectedProduct.id)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === selectedProduct.id ? { ...item, quantity: item.quantity + orderQuantity } : item,
        ),
      )
    } else {
      setCart([...cart, { product: selectedProduct, quantity: orderQuantity }])
    }

    setSelectedProduct(null)
    alert("Added to cart!")
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vendor Marketplace</h1>
            <p className="text-muted-foreground">Browse fresh farm products</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Button variant="outline" onClick={() => setShowCart(!showCart)} className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
            <Link href="/">
              <Button variant="outline">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
                  <Input
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Found {filteredProducts.length} products</p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-4xl">🥬</span>
                    </div>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">per unit</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.quantity > 10
                              ? "bg-primary/10 text-primary"
                              : product.quantity > 0
                                ? "bg-secondary/10 text-secondary"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {product.quantity > 0 ? `${product.quantity} left` : "Out of stock"}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.quantity === 0}
                        className="w-full"
                      >
                        {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Shopping Cart
                </CardTitle>
                <CardDescription>{cart.length} items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between items-start gap-2 p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ${item.product.price.toFixed(2)}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-semibold">Free</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full">Proceed to Checkout</Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => setCart([])}>
                        Clear Cart
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedProduct.name}</CardTitle>
              <CardDescription>{selectedProduct.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Price per unit</p>
                <p className="text-3xl font-bold text-primary">${selectedProduct.price.toFixed(2)}</p>
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
                <p className="text-xs text-muted-foreground mt-1">Available: {selectedProduct.quantity} units</p>
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
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

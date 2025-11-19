"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Leaf, LogOut, ShoppingCart, Package, Menu, X } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  quantity: number
  farmer?: string
  image?: string
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Tomato", price: 30, category: "Vegetables", quantity: 100, farmer: "Raj Kumar (Punjab)" },
  { id: "2", name: "Onion", price: 25, category: "Vegetables", quantity: 80, farmer: "Amit Sharma (Maharashtra)" },
  { id: "3", name: "Strawberry", price: 150, category: "Fruits", quantity: 60, farmer: "Priya Patel (Gujarat)" },
  { id: "4", name: "Potato", price: 20, category: "Vegetables", quantity: 100, farmer: "Vikram Singh (Uttar Pradesh)" },
  { id: "5", name: "Spinach", price: 40, category: "Leafy Vegetables", quantity: 50, farmer: "Neha Verma (Karnataka)" },
  { id: "6", name: "Orange", price: 50, category: "Fruits", quantity: 70, farmer: "Raj Kumar (Punjab)" },
  { id: "7", name: "Apple", price: 80, category: "Fruits", quantity: 45, farmer: "Amit Sharma (Maharashtra)" },
  { id: "8", name: "Ginger", price: 60, category: "Spices", quantity: 30, farmer: "Priya Patel (Gujarat)" },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState({ name: "", email: "" })
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [cart, setCart] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "100", category: "Vegetables" })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedCart = localStorage.getItem("cart")
    const savedProducts = localStorage.getItem("products")
    const savedOrders = localStorage.getItem("orders")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    } else {
      router.push("/login")
    }
  }, [router])

  const getUserOrders = () => {
    return orders.filter((order) => order.vendorEmail === user.email || order.buyerEmail === user.email)
  }

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        category: newProduct.category,
        quantity: Number.parseInt(newProduct.quantity),
        farmer: user.name,
      }
      const updatedProducts = [...products, product]
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      setNewProduct({ name: "", price: "", quantity: "100", category: "Vegetables" })
      alert("Product added successfully!")
    }
  }

  const handleAddToCart = (product: Product) => {
    const existing = cart.find((p) => p.id === product.id)
    if (existing) {
      const updated = cart.map((p) => (p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p))
      setCart(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }]
      setCart(newCart)
      localStorage.setItem("cart", JSON.stringify(newCart))
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    const updated = cart.filter((p) => p.id !== productId)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    const newOrder = {
      id: "ORD" + Date.now(),
      items: cart.map((p) => `${p.name} (${p.quantity}kg)`).join(", "),
      buyerEmail: user.email,
      vendorEmail: "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      amount: cartTotal,
    }

    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    alert("Order placed successfully! Total: ₹" + cartTotal.toFixed(2))
    setCart([])
    localStorage.setItem("cart", JSON.stringify([]))
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userRole")
    localStorage.removeItem("cart")
    router.push("/")
  }

  const cartTotal = cart.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0)

  const getProductsByCategory = (category: string) => {
    return products.filter((p) => p.category === category)
  }

  const categories = ["Vegetables", "Fruits", "Spices", "Leafy Vegetables"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">FarmerHub</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <span className="text-muted-foreground">Welcome, {user.name}</span>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="myproducts">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders ({getUserOrders().length})</TabsTrigger>
            <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow border-border/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.farmer}</p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                        {product.quantity} kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">₹{product.price}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Category Filters Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-foreground mb-6">Browse by Category</h3>
              <div className="space-y-8">
                {categories.map((category) => (
                  <div key={category}>
                    <h4 className="text-lg font-semibold text-foreground mb-4">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {getProductsByCategory(category).length > 0 ? (
                        getProductsByCategory(category).map((product) => (
                          <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow border-border/50">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-foreground">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                <p className="text-xs text-muted-foreground mt-1">{product.farmer}</p>
                              </div>
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                                {product.quantity} kg
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-primary">₹{product.price}</span>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Add
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm col-span-full">No products in this category</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Products Tab */}
          <TabsContent value="myproducts" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Spices</option>
                  <option>Leafy Vegetables</option>
                </select>
                <Input
                  placeholder="Price (₹)"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <Input
                  placeholder="Quantity (kg)"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
              </div>
              <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
                Add Product
              </Button>
            </Card>

            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Your Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => p.farmer === user.name)
                  .map((product) => (
                    <Card key={product.id} className="p-4 border-border/50">
                      <h4 className="font-bold text-foreground mb-2">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{product.category}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-primary">₹{product.price}</span>
                          <p className="text-xs text-muted-foreground">{product.quantity} kg</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </Card>
                  ))}
                {products.filter((p) => p.farmer === user.name).length === 0 && (
                  <Card className="p-8 text-center col-span-full">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground">No products yet</p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {getUserOrders().length > 0 ? (
              <div className="space-y-4">
                {getUserOrders().map((order) => (
                  <Card key={order.id} className="p-6 border-border/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-2">{order.id}</h4>
                        <p className="text-sm text-muted-foreground mb-1">Items: {order.items}</p>
                        <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : order.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-primary mt-2">₹{order.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground">No orders yet</p>
              </Card>
            )}
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart" className="space-y-6">
            {cart.length > 0 ? (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="p-4 border-border/50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.farmer}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-destructive"
                        >
                          ✕
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm">
                          ₹{item.price} × {item.quantity || 1}
                        </span>
                        <span className="font-bold text-primary">
                          ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card className="p-6 bg-primary/5">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-foreground">Total:</span>
                    <span className="text-3xl font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-primary to-accent h-10">
                    Checkout
                  </Button>
                </Card>
              </>
            ) : (
              <Card className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

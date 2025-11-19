"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Star, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  rating: number
  sold: number
  farmer?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newProduct, setNewProduct] = useState({ name: "", category: "Vegetables", price: "", quantity: "" })
  const [user, setUser] = useState({ name: "" })

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedProducts = localStorage.getItem("products")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const defaultProducts: Product[] = [
        {
          id: "1",
          name: "Tomato",
          category: "Vegetables",
          price: 30,
          quantity: 100,
          rating: 4.8,
          sold: 245,
          farmer: "Raj Kumar",
        },
        {
          id: "2",
          name: "Lettuce",
          category: "Vegetables",
          price: 40,
          quantity: 80,
          rating: 4.6,
          sold: 180,
          farmer: "Amit Sharma",
        },
        {
          id: "3",
          name: "Strawberry",
          category: "Fruits",
          price: 150,
          quantity: 60,
          rating: 4.9,
          sold: 320,
          farmer: "Priya Patel",
        },
        {
          id: "4",
          name: "Orange",
          category: "Fruits",
          price: 50,
          quantity: 70,
          rating: 4.7,
          sold: 210,
          farmer: "Vikram Singh",
        },
        {
          id: "5",
          name: "Ginger",
          category: "Spices",
          price: 60,
          quantity: 30,
          rating: 4.5,
          sold: 90,
          farmer: "Neha Verma",
        },
      ]
      setProducts(defaultProducts)
      localStorage.setItem("products", JSON.stringify(defaultProducts))
    }
  }, [])

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      if (editingId) {
        const updatedProducts = products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: newProduct.name,
                category: newProduct.category,
                price: Number.parseFloat(newProduct.price),
                quantity: Number.parseInt(newProduct.quantity),
              }
            : p,
        )
        setProducts(updatedProducts)
        localStorage.setItem("products", JSON.stringify(updatedProducts))
        setEditingId(null)
        alert("Product updated successfully!")
      } else {
        const product: Product = {
          id: Date.now().toString(),
          name: newProduct.name,
          category: newProduct.category,
          price: Number.parseFloat(newProduct.price),
          quantity: Number.parseInt(newProduct.quantity),
          rating: 4.5,
          sold: 0,
          farmer: user.name,
        }
        const updatedProducts = [...products, product]
        setProducts(updatedProducts)
        localStorage.setItem("products", JSON.stringify(updatedProducts))
        alert("Product added successfully!")
      }
      setNewProduct({ name: "", category: "Vegetables", price: "", quantity: "" })
      setShowForm(false)
    }
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      alert("Product deleted successfully!")
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id)
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    })
    setShowForm(true)
  }

  const getProductsByCategory = (category: string) => {
    return products.filter((p) => p.category === category)
  }

  const categories = ["Vegetables", "Fruits", "Spices", "Leafy Vegetables"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your inventory and listings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-primary to-accent">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <h3 className="font-bold text-foreground mb-4">{editingId ? "Edit Product" : "Add New Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground"
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
              placeholder="Quantity"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <div className="flex gap-2">
              <Button onClick={handleAddProduct} className="flex-1">
                {editingId ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setNewProduct({ name: "", category: "Vegetables", price: "", quantity: "" })
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-auto grid-flow-col">
          <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat.toLowerCase()}>
              {cat} ({getProductsByCategory(cat).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent">
              <TrendingUp className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold text-foreground">{products.reduce((sum, p) => sum + p.sold, 0)}</div>
              <p className="text-sm text-muted-foreground">Total Units Sold</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent">
              <Star className="w-6 h-6 text-accent mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="text-2xl font-bold text-foreground">
                ₹{products.reduce((sum, p) => sum + p.price * p.sold, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </Card>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{product.category}</td>
                    <td className="px-6 py-4 font-semibold text-primary">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.sold}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive bg-transparent"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {getProductsByCategory(category).map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                      <td className="px-6 py-4 font-semibold text-primary">₹{product.price}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{product.sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

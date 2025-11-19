export interface User {
  id: string
  email: string
  name: string
  role: "farmer" | "vendor"
  location: { latitude: number; longitude: number }
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  farmerId: string
  name: string
  description?: string
  price: number
  quantity: number
  category: string
  location: { latitude: number; longitude: number }
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  vendorId: string
  farmerId: string
  productId: string
  quantity: number
  totalPrice: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: Date
  updatedAt: Date
}

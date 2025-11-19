import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "vendor") {
      return NextResponse.json({ error: "Only vendors can place orders" }, { status: 403 })
    }

    const { productId, quantity } = await request.json()

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get product details
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient quantity" }, { status: 400 })
    }

    // Create order
    const result = await db.collection("orders").insertOne({
      vendorId: new ObjectId(decoded.userId),
      farmerId: product.farmerId,
      productId: new ObjectId(productId),
      quantity,
      totalPrice: product.price * quantity,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update product quantity
    await db.collection("products").updateOne({ _id: new ObjectId(productId) }, { $inc: { quantity: -quantity } })

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: result.insertedId,
          productId,
          quantity,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const query =
      decoded.role === "farmer"
        ? { farmerId: new ObjectId(decoded.userId) }
        : { vendorId: new ObjectId(decoded.userId) }

    const orders = await db.collection("orders").find(query).toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Get orders error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

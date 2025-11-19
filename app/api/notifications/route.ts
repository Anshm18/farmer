import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

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

    // Get notifications based on user role
    let query: any = {}

    if (decoded.role === "farmer") {
      // Farmers see notifications for their orders
      query = {
        farmerId: new ObjectId(decoded.userId),
      }
    } else {
      // Vendors see notifications for their orders
      query = {
        vendorId: new ObjectId(decoded.userId),
      }
    }

    // Get recent orders with notifications
    const notifications = await db.collection("orders").find(query).sort({ updatedAt: -1 }).limit(10).toArray()

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("[v0] Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

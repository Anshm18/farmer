import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "farmer") {
      return NextResponse.json({ error: "Only farmers can update orders" }, { status: 403 })
    }

    const { status } = await request.json()

    if (!status || !["pending", "confirmed", "shipped", "delivered"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("orders").findOneAndUpdate(
      {
        _id: new ObjectId(params.id),
        farmerId: new ObjectId(decoded.userId),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result.value) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Order updated successfully",
      order: result.value,
    })
  } catch (error) {
    console.error("[v0] Update order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

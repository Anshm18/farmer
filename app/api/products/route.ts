import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get query parameters for filtering and location-based search
    const { searchParams } = new URL(request.url)
    const latitude = searchParams.get("lat")
    const longitude = searchParams.get("lon")
    const radius = searchParams.get("radius") || "10000" // default 10km

    const query: any = { isActive: true }

    // Location-based search using geospatial query
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
          },
          $maxDistance: Number.parseInt(radius),
        },
      }
    }

    const products = await db.collection("products").find(query).limit(50).toArray()

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[v0] Get products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "farmer") {
      return NextResponse.json({ error: "Only farmers can add products" }, { status: 403 })
    }

    const { name, description, price, quantity, category, location, image } = await request.json()

    if (!name || !price || !quantity || !category || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("products").insertOne({
      farmerId: new ObjectId(decoded.userId),
      name,
      description,
      price,
      quantity,
      category,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      image,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: {
          id: result.insertedId,
          name,
          price,
          quantity,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

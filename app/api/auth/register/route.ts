import { connectToDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, location, phone } = await request.json()

    if (!email || !password || !name || !role || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name,
      role,
      location,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
    })

    const token = generateToken(result.insertedId.toString(), email, role)

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: result.insertedId,
          email,
          name,
          role,
          location,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

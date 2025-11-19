import { connectToDatabase } from "@/lib/mongodb"

async function setupDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Create collections and indexes
    const collections = ["users", "products", "orders", "reviews"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`[v0] Created collection: ${collectionName}`)
      } catch (err: any) {
        if (err.codeName !== "NamespaceExists") {
          throw err
        }
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("products").createIndex({ farmerId: 1 })
    await db.collection("products").createIndex({ location: "2dsphere" })
    await db.collection("orders").createIndex({ vendorId: 1 })
    await db.collection("orders").createIndex({ farmerId: 1 })

    console.log("[v0] Database setup complete")
  } catch (err) {
    console.error("[v0] Database setup error:", err)
    throw err
  }
}

setupDatabase()

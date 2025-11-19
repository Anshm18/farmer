import { MongoClient } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db("farmer-marketplace")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

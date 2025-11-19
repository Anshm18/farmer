import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface DecodedToken {
  userId: string
  email: string
  role: "farmer" | "vendor"
  iat?: number
}

export function generateToken(userId: string, email: string, role: "farmer" | "vendor"): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as DecodedToken
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

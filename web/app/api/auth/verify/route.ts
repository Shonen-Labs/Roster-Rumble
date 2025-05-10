import { NextResponse } from "next/server"
import Redis from "ioredis"
import { ec } from "starknet"
import jwt from "jsonwebtoken"

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
})

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// StarkNet EC for signature verification
const starknetEc = ec.starkCurve

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { walletAddress, signature } = body

    // Validate required fields
    if (!walletAddress || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get nonce from Redis
    const nonceKey = `nonce:${walletAddress}`
    const nonce = await redis.get(nonceKey)

    // Check if nonce exists
    if (!nonce) {
      return NextResponse.json({ error: "No valid nonce found for this wallet address" }, { status: 401 })
    }

    // Create a message hash using the nonce
    // The pedersen function requires two arguments
    // For a simple hash of a single value, we can use a zero value as the second argument
    // or hash the nonce with itself depending on your verification requirements
    const messageHash = starknetEc.pedersen(nonce, "0")

    // Verify signature
    const isValid = starknetEc.verify(messageHash, signature, walletAddress)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Delete the used nonce immediately
    await redis.del(nonceKey)

    // Generate JWT with 24h expiry
    const token = jwt.sign({ sub: walletAddress }, JWT_SECRET, { expiresIn: "24h" })

    // Return the JWT
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

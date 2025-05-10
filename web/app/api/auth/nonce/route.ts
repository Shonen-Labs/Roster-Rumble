import { NextResponse } from "next/server"
import Redis from "ioredis"
import crypto from "crypto"

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
})

// Nonce expiration time (10 minutes)
const NONCE_EXPIRY = 60 * 10

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { walletAddress } = body

    // Validate required fields
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Generate a random nonce
    const nonce = crypto.randomBytes(32).toString("hex")

    // Store nonce in Redis with expiration
    const nonceKey = `nonce:${walletAddress}`
    await redis.set(nonceKey, nonce, "EX", NONCE_EXPIRY)

    // Return the nonce
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("Nonce generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

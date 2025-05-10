import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from "c:/Users/USER/Desktop/Roster-Rumble/web/lib/redis";
import { NextResponse } from "next/server"
import Redis from "ioredis"
import crypto from "crypto"

const generateNonce = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const NONCE_TTL = 300;

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl || new URL(request.url);
    const walletAddress = url.searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameter: walletAddress' },
        { status: 400 }
      );
    }

    // Generate a new nonce
    const nonce = generateNonce();

    try {
      // Store the nonce in Redis with a 5-minute TTL
      const redis = await getRedisClient();
      const nonceKey = `auth:nonce:${walletAddress}`;
      
      await redis.set(nonceKey, nonce, { EX: NONCE_TTL });
      
      // Return the nonce as JSON
      return NextResponse.json({ nonce });
    } catch (redisError) {
      console.error('Redis error:', redisError);
      return NextResponse.json(
        { error: 'Failed to store nonce' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}

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

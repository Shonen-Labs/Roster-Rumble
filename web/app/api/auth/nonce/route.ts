import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRedisClient } from "c:/Users/USER/Desktop/Roster-Rumble/web/lib/redis";

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
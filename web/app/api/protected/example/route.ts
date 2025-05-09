import { type NextRequest, NextResponse } from "next/server"
import { authMiddleware, type JwtPayload } from "@/lib/auth"

async function handler(req: NextRequest, user: JwtPayload) {
  // The user is authenticated, and the wallet address is available in user.sub
  return NextResponse.json({
    message: "This is a protected endpoint",
    walletAddress: user.sub,
  })
}

export async function GET(req: NextRequest) {
  return authMiddleware(req, handler)
}

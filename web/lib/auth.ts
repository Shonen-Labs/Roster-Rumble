import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface JwtPayload {
  sub: string // wallet address
  iat: number
  exp: number
}

/**
 * Verify JWT token from Authorization header
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract JWT token from Authorization header
 */
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.substring(7)
}

/**
 * Middleware to protect routes
 */
export async function authMiddleware(
  req: NextRequest,
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>,
): Promise<NextResponse> {
  const token = extractToken(req)

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }

  return handler(req, payload)
}

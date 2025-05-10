import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken, extractToken } from "../../lib/auth"

// Paths that require authentication
const PROTECTED_PATHS = [
  "/api/protected",
  // Add other protected paths here
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is protected
  if (PROTECTED_PATHS.some((prefix) => path.startsWith(prefix))) {
    const token = extractToken(request)

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/protected/:path*",
    // Add other protected path patterns here
  ],
}

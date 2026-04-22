import { NextRequest, NextResponse } from "next/server"
import { authEdge } from "@/lib/auth-edge"

export default authEdge((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Require sign-in
  const protectedPaths = ["/orders", "/profile", "/checkout", "/cart"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp).*)",
  ],
}

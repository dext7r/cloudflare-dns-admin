import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const PUBLIC_PATHS = ["/", "/login", "/docs"]

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/")))
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isApi = pathname.startsWith("/api/")

  if (req.auth && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!req.auth && !isPublic(pathname)) {
    if (isApi) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (req.auth?.user.role !== "ADMIN" && (pathname.startsWith("/admin") || pathname.startsWith("/api/admin"))) {
    if (isApi) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.redirect(new URL("/", req.url))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|api/auth).*)"],
}


import type { Session } from "next-auth"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

type AuthGuardResult = {
  error: NextResponse | null
  session: Session | null
}

export async function requireAuth(requiredRole?: "ADMIN"): Promise<AuthGuardResult> {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      session: null,
    }
  }

  if (requiredRole === "ADMIN" && session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      ),
      session: null,
    }
  }

  return { error: null, session }
}

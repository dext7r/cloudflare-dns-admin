import { NextRequest, NextResponse } from "next/server"
import { listZones } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth()
  if (error) return error

  try {
    const accountId = request.nextUrl.searchParams.get("accountId")
    const token = await resolveToken(accountId, session)
    const zones = await listZones(token)
    return NextResponse.json({ success: true, result: zones })
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取域名列表失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { purgeCacheAll, purgeCacheByUrls } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    if (!zoneId) return NextResponse.json({ success: false, error: "缺少 zoneId 参数" }, { status: 400 })
    const token = await resolveToken(searchParams.get("accountId") ?? undefined, session)
    const body = await request.json()
    const urls = body.urls
    const result =
      Array.isArray(urls) && urls.length > 0 && urls.every((u: unknown) => typeof u === "string")
        ? await purgeCacheByUrls(zoneId, urls as string[], token)
        : await purgeCacheAll(zoneId, token)
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "清除失败" }, { status: 500 })
  }
}

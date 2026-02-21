import { NextRequest, NextResponse } from "next/server"
import { listBulkRedirectLists, getCfAccountId } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = request.nextUrl
    const accountId = searchParams.get("accountId") ?? undefined
    if (!accountId) return NextResponse.json({ success: false, error: "缺少 accountId 参数" }, { status: 400 })
    const token = await resolveToken(accountId, session)
    const cfAccountId = await getCfAccountId(token)
    if (!cfAccountId) return NextResponse.json({ success: false, error: "无法获取 Cloudflare 账号 ID" }, { status: 400 })
    const result = await listBulkRedirectLists(cfAccountId, token)
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "获取失败" }, { status: 500 })
  }
}

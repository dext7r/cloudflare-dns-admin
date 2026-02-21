import { NextRequest, NextResponse } from "next/server"
import { listZoneSettings, updateZoneSetting } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth()
  if (error) return error
  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    if (!zoneId) return NextResponse.json({ success: false, error: "缺少 zoneId 参数" }, { status: 400 })
    const token = await resolveToken(searchParams.get("accountId") ?? undefined, session)
    const result = await listZoneSettings(zoneId, token)
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "获取失败" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    const settingId = searchParams.get("settingId")
    if (!zoneId || !settingId) return NextResponse.json({ success: false, error: "缺少参数" }, { status: 400 })
    const { value } = await request.json()
    const token = await resolveToken(searchParams.get("accountId") ?? undefined, session)
    const result = await updateZoneSetting(zoneId, settingId, value, token)
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "更新失败" }, { status: 500 })
  }
}

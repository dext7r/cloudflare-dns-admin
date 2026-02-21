import { NextRequest, NextResponse } from "next/server"
import { updateEmailRoutingRule, deleteEmailRoutingRule } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { id } = await params
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    if (!zoneId) return NextResponse.json({ success: false, error: "缺少 zoneId 参数" }, { status: 400 })
    const token = await resolveToken(searchParams.get("accountId") ?? undefined, session)
    const body = await request.json()
    const result = await updateEmailRoutingRule(zoneId, id, body, token)
    return NextResponse.json({ success: true, result })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "更新失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { id } = await params
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    if (!zoneId) return NextResponse.json({ success: false, error: "缺少 zoneId 参数" }, { status: 400 })
    const token = await resolveToken(searchParams.get("accountId") ?? undefined, session)
    await deleteEmailRoutingRule(zoneId, id, token)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "删除失败" }, { status: 500 })
  }
}

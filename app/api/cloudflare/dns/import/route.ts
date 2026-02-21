import { NextRequest, NextResponse } from "next/server"
import { importDnsRecords } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const body = await request.json()
    const { zoneId, content, accountId } = body as {
      zoneId: string
      content: string
      accountId?: string | null
    }

    if (!zoneId || !content) {
      return NextResponse.json({ success: false, error: "缺少 zoneId 或文件内容" }, { status: 400 })
    }

    const token = await resolveToken(accountId)
    const result = await importDnsRecords(zoneId, content, token)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "导入 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

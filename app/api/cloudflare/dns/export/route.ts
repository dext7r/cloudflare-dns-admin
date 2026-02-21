import { NextRequest, NextResponse } from "next/server"
import { exportDnsRecords } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth()
  if (error) return error

  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")

    if (!zoneId) {
      return NextResponse.json({ success: false, error: "缺少 zoneId" }, { status: 400 })
    }

    const accountId = searchParams.get("accountId")
    const token = await resolveToken(accountId, session)
    const content = await exportDnsRecords(zoneId, token)
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="dns_records.txt"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "导出 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

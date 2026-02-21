import { NextRequest, NextResponse } from "next/server"
import { importDnsRecords } from "@/lib/cloudflare"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zoneId, content } = body as { zoneId: string; content: string }

    if (!zoneId || !content) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId 或文件内容" },
        { status: 400 }
      )
    }

    const result = await importDnsRecords(zoneId, content)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "导入 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

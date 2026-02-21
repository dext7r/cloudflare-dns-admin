import { NextRequest, NextResponse } from "next/server"
import { exportDnsRecords } from "@/lib/cloudflare"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")

    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId" },
        { status: 400 }
      )
    }

    const content = await exportDnsRecords(zoneId)
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

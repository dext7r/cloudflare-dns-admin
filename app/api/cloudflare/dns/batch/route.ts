import { NextRequest, NextResponse } from "next/server"
import { deleteDnsRecord } from "@/lib/cloudflare"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zoneId, recordIds } = body as {
      zoneId: string
      recordIds: string[]
    }

    if (!zoneId || !recordIds?.length) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId 或 recordIds" },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      recordIds.map((id) => deleteDnsRecord(zoneId, id))
    )

    const failed = results.filter((r) => r.status === "rejected")
    if (failed.length > 0) {
      return NextResponse.json({
        success: true,
        deleted: recordIds.length - failed.length,
        failed: failed.length,
        total: recordIds.length,
      })
    }

    return NextResponse.json({
      success: true,
      deleted: recordIds.length,
      failed: 0,
      total: recordIds.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "批量删除失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { deleteDnsRecord } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const body = await request.json()
    const { zoneId, recordIds, accountId } = body as {
      zoneId: string
      recordIds: string[]
      accountId?: string | null
    }

    if (!zoneId || !recordIds?.length) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId 或 recordIds" },
        { status: 400 }
      )
    }

    const token = await resolveToken(accountId)
    const results = await Promise.allSettled(
      recordIds.map((id) => deleteDnsRecord(zoneId, id, token))
    )

    const failed = results.filter((r) => r.status === "rejected")
    return NextResponse.json({
      success: true,
      deleted: recordIds.length - failed.length,
      failed: failed.length,
      total: recordIds.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "批量删除失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

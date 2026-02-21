import { NextRequest, NextResponse } from "next/server"
import { updateDnsRecord, deleteDnsRecord, getZone } from "@/lib/cloudflare"
import { resolveToken } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"
import { writeAuditLog } from "@/lib/audit"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const { zoneId, accountId, ...recordData } = body

    if (!zoneId) {
      return NextResponse.json({ success: false, error: "缺少 zoneId" }, { status: 400 })
    }

    const token = await resolveToken(accountId)

    const protectedZones = (process.env.PROTECTED_ZONES ?? "")
      .split(",").map(s => s.trim()).filter(Boolean)
    if (protectedZones.length > 0) {
      const zone = await getZone(zoneId, token)
      if (zone && protectedZones.includes(zone.name)) {
        return NextResponse.json(
          { success: false, error: "该域名为受保护域名，禁止修改 DNS 记录" },
          { status: 403 }
        )
      }
    }

    const record = await updateDnsRecord(zoneId, id, token, recordData)
    const zone = await getZone(zoneId, token).catch(() => null)
    writeAuditLog({
      userId: session!.user.id as string,
      userEmail: session!.user.email!,
      action: "dns.update",
      zoneId,
      zoneName: zone?.name,
      target: `${recordData.type} ${recordData.name}`,
      after: record,
    })
    return NextResponse.json({ success: true, result: record })
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const { id } = await params
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")

    if (!zoneId) {
      return NextResponse.json({ success: false, error: "缺少 zoneId" }, { status: 400 })
    }

    const accountId = searchParams.get("accountId")
    const token = await resolveToken(accountId)

    const protectedZones = (process.env.PROTECTED_ZONES ?? "")
      .split(",").map(s => s.trim()).filter(Boolean)
    if (protectedZones.length > 0) {
      const zone = await getZone(zoneId, token)
      if (zone && protectedZones.includes(zone.name)) {
        return NextResponse.json(
          { success: false, error: "该域名为受保护域名，禁止删除 DNS 记录" },
          { status: 403 }
        )
      }
    }

    await deleteDnsRecord(zoneId, id, token)
    const zone = await getZone(zoneId, token).catch(() => null)
    writeAuditLog({
      userId: session!.user.id as string,
      userEmail: session!.user.email!,
      action: "dns.delete",
      zoneId,
      zoneName: zone?.name,
      target: id,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

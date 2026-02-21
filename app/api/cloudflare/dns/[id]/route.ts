import { NextRequest, NextResponse } from "next/server"
import { updateDnsRecord, deleteDnsRecord } from "@/lib/cloudflare"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { zoneId, ...recordData } = body

    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId" },
        { status: 400 }
      )
    }

    const record = await updateDnsRecord(zoneId, id, recordData)
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
  try {
    const { id } = await params
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")

    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId" },
        { status: 400 }
      )
    }

    await deleteDnsRecord(zoneId, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

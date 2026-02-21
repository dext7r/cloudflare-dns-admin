import { NextRequest, NextResponse } from "next/server"
import { listDnsRecords, createDnsRecord } from "@/lib/cloudflare"
import type { DnsRecordFilters } from "@/lib/dns-types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const zoneId = searchParams.get("zoneId")
    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId 参数" },
        { status: 400 }
      )
    }

    const filters: DnsRecordFilters = {}
    const type = searchParams.get("type")
    const name = searchParams.get("name")
    const content = searchParams.get("content")
    const page = searchParams.get("page")
    const perPage = searchParams.get("per_page")
    const order = searchParams.get("order")
    const direction = searchParams.get("direction")

    if (type) filters.type = type as DnsRecordFilters["type"]
    if (name) filters.name = name
    if (content) filters.content = content
    if (page) filters.page = parseInt(page)
    if (perPage) filters.per_page = parseInt(perPage)
    if (order) filters.order = order as DnsRecordFilters["order"]
    if (direction) filters.direction = direction as DnsRecordFilters["direction"]

    const data = await listDnsRecords(zoneId, filters)
    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zoneId, ...recordData } = body

    if (!zoneId) {
      return NextResponse.json(
        { success: false, error: "缺少 zoneId" },
        { status: 400 }
      )
    }

    const record = await createDnsRecord(zoneId, recordData)
    return NextResponse.json({ success: true, result: record })
  } catch (error) {
    const message = error instanceof Error ? error.message : "创建 DNS 记录失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

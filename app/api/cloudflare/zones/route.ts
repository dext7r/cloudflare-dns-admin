import { NextResponse } from "next/server"
import { listZones } from "@/lib/cloudflare"

export async function GET() {
  try {
    const zones = await listZones()
    return NextResponse.json({ success: true, result: zones })
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取域名列表失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

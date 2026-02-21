import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { searchParams } = request.nextUrl
    const rawPage = parseInt(searchParams.get("page") ?? "1")
    const rawSize = parseInt(searchParams.get("pageSize") ?? "50")
    const page = Math.max(1, Number.isFinite(rawPage) ? rawPage : 1)
    const pageSize = Math.min(100, Math.max(1, Number.isFinite(rawSize) ? rawSize : 50))
    const action = searchParams.get("action") ?? undefined
    const userEmail = searchParams.get("userEmail") ?? undefined
    const zoneId = searchParams.get("zoneId") ?? undefined

    const where = {
      ...(action ? { action: { contains: action } } : {}),
      ...(userEmail ? { userEmail: { contains: userEmail, mode: "insensitive" as const } } : {}),
      ...(zoneId ? { zoneId } : {}),
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ])

    return NextResponse.json({ success: true, result: logs, total, page, pageSize })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "获取失败" }, { status: 500 })
  }
}

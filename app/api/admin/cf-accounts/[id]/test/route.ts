import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth()
  if (error) return error

  const { id } = await params
  const account = await prisma.cfAccount.findUnique({ where: { id } })
  if (!account) {
    return NextResponse.json({ success: false, error: "账号不存在" }, { status: 404 })
  }

  const now = new Date()

  try {
    const token = decrypt(account.encryptedToken)
    const res = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=1", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()

    if (!json.success) {
      await prisma.cfAccount.update({
        where: { id },
        data: { lastTestAt: now, lastTestStatus: "error" },
      })
      return NextResponse.json({
        success: false,
        error: json.errors?.[0]?.message ?? "Token 无效",
      })
    }

    await prisma.cfAccount.update({
      where: { id },
      data: { lastTestAt: now, lastTestStatus: "ok" },
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    await prisma.cfAccount.update({
      where: { id },
      data: { lastTestAt: now, lastTestStatus: "error" },
    }).catch(() => {})
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "测试失败" },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

const accountSelect = {
  id: true,
  name: true,
  createdAt: true,
  lastTestAt: true,
  lastTestStatus: true,
} as const

export async function GET() {
  const { error, session } = await requireAuth()
  if (error) return error

  const role = (session!.user as any).role as string
  let accounts

  if (role === "ADMIN") {
    accounts = await prisma.cfAccount.findMany({
      select: accountSelect,
      orderBy: { createdAt: "asc" },
    })
  } else {
    const bindings = await prisma.userCfAccount.findMany({
      where: { userId: session!.user.id! },
      select: { cfAccount: { select: accountSelect } },
      orderBy: { cfAccount: { createdAt: "asc" } },
    })
    accounts = bindings.map((b) => b.cfAccount)
  }

  return NextResponse.json({ success: true, result: accounts })
}

const createSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  token: z.string().trim().min(1, "Token 不能为空"),
})

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "参数无效" },
        { status: 400 }
      )
    }

    const token = parsed.data.token

    const cfRes = await fetch("https://api.cloudflare.com/client/v4/zones?per_page=1", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const cfJson = await cfRes.json()
    if (!cfJson.success) {
      return NextResponse.json(
        { success: false, error: `Token 无效：${cfJson.errors?.[0]?.message ?? "验证失败"}` },
        { status: 400 }
      )
    }

    const account = await prisma.cfAccount.create({
      data: { name: parsed.data.name, encryptedToken: encrypt(parsed.data.token) },
      select: { id: true, name: true, createdAt: true },
    })
    return NextResponse.json({ success: true, result: account })
  } catch (err) {
    const message = err instanceof Error ? err.message : "创建失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

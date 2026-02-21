import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

const createUserSchema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(8, "密码至少 8 位"),
  name: z.string().trim().max(100).optional(),
  role: z.enum(["ADMIN", "VIEWER"]).default("VIEWER"),
})

export async function GET() {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      cfAccounts: { select: { cfAccountId: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({
    success: true,
    result: users.map(({ cfAccounts, ...u }) => ({
      ...u,
      cfAccountIds: cfAccounts.map((c) => c.cfAccountId),
    })),
  })
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "参数错误" },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()
    const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (exists) {
      return NextResponse.json({ success: false, error: "该邮箱已存在" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const user = await prisma.user.create({
      data: { email, passwordHash, name: parsed.data.name, role: parsed.data.role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    return NextResponse.json({ success: true, result: user }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: "创建用户失败" }, { status: 500 })
  }
}

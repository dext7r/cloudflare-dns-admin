import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

const schema = z.object({ cfAccountIds: z.array(z.string()) })

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  const { id } = await params
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "参数错误" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } })
  if (!user) {
    return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
  }

  await prisma.$transaction([
    prisma.userCfAccount.deleteMany({ where: { userId: id } }),
    ...(parsed.data.cfAccountIds.length > 0
      ? [
          prisma.userCfAccount.createMany({
            data: parsed.data.cfAccountIds.map((cfAccountId) => ({ userId: id, cfAccountId })),
          }),
        ]
      : []),
  ])

  return NextResponse.json({ success: true })
}

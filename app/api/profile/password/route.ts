import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

const schema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(8, "新密码至少 8 位"),
})

export async function PATCH(request: NextRequest) {
  const { error, session } = await requireAuth()
  if (error) return error

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "参数错误" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { passwordHash: true },
    })
    if (!user) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
    }

    const matched = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
    if (!matched) {
      return NextResponse.json({ success: false, error: "当前密码错误" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12)
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { passwordHash },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: "修改密码失败" }, { status: 500 })
  }
}

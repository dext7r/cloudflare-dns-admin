import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"

const updateRoleSchema = z.object({ role: z.enum(["ADMIN", "VIEWER"]) })

function isPrismaNotFound(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2025"
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  const { id } = await params

  try {
    const parsed = updateRoleSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "参数错误" },
        { status: 400 }
      )
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    })
    if (!target) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
    }

    if (target.role === "ADMIN" && parsed.data.role === "VIEWER") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: "系统至少需要保留一个管理员" },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    return NextResponse.json({ success: true, result: updated })
  } catch (e) {
    if (isPrismaNotFound(e)) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
    }
    return NextResponse.json({ success: false, error: "更新用户角色失败" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth("ADMIN")
  if (error) return error

  const { id } = await params

  try {
    if (session!.user.id === id) {
      return NextResponse.json({ success: false, error: "不能删除当前登录账号" }, { status: 400 })
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    })
    if (!target) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
    }

    if (target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } })
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: "系统至少需要保留一个管理员" },
          { status: 400 }
        )
      }
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if (isPrismaNotFound(e)) {
      return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 })
    }
    return NextResponse.json({ success: false, error: "删除用户失败" }, { status: 500 })
  }
}

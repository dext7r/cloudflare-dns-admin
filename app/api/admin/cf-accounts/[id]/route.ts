import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"

const updateSchema = z.object({
  name: z.string().min(1, "名称不能为空"),
  token: z.string().trim().min(1).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "参数错误" }, { status: 400 })
    }

    const data: { name: string; encryptedToken?: string } = { name: parsed.data.name }
    if (parsed.data.token) {
      data.encryptedToken = encrypt(parsed.data.token)
    }

    const account = await prisma.cfAccount.update({
      where: { id },
      data,
      select: { id: true, name: true, createdAt: true },
    })
    return NextResponse.json({ success: true, result: account })
  } catch (err) {
    const message = err instanceof Error ? err.message : "更新失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error

  try {
    const { id } = await params
    await prisma.cfAccount.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "删除失败"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

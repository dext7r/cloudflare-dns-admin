import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"
import { z, ZodError } from "zod"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  events: z.array(z.string()).min(1).optional(),
  secret: z.string().optional(),
  enabled: z.boolean().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { id } = await params
    const body = patchSchema.parse(await request.json())
    const webhook = await prisma.webhook.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, result: webhook })
  } catch (e) {
    if (e instanceof ZodError)
      return NextResponse.json({ success: false, error: e.errors[0]?.message ?? "参数无效" }, { status: 400 })
    if ((e as { code?: string }).code === "P2025")
      return NextResponse.json({ success: false, error: "Webhook 不存在" }, { status: 404 })
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "更新失败" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const { id } = await params
    await prisma.webhook.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if ((e as { code?: string }).code === "P2025")
      return NextResponse.json({ success: false, error: "Webhook 不存在" }, { status: 404 })
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "删除失败" }, { status: 500 })
  }
}

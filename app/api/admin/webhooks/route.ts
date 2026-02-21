import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-guard"
import { z, ZodError } from "zod"

const createSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().optional(),
  enabled: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const webhooks = await prisma.webhook.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json({ success: true, result: webhooks })
  } catch (e) {
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "获取失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth("ADMIN")
  if (error) return error
  try {
    const body = createSchema.parse(await request.json())
    const webhook = await prisma.webhook.create({ data: body })
    return NextResponse.json({ success: true, result: webhook })
  } catch (e) {
    if (e instanceof ZodError)
      return NextResponse.json({ success: false, error: e.errors[0]?.message ?? "参数无效" }, { status: 400 })
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : "创建失败" }, { status: 500 })
  }
}

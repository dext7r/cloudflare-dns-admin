import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/cf-token"
import { requireAuth } from "@/lib/auth-guard"
import type { Permission, PermStatus } from "@/types/cf-token"

export type { Permission, PermStatus }

const CF_API = "https://api.cloudflare.com/client/v4"

async function probe(url: string, token: string): Promise<PermStatus> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    return res.status === 403 ? "missing" : "ok"
  } catch {
    return "error"
  }
}

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

    // Step 1: Zone read — required, also extracts zoneId and CF account ID
    const zonesRes = await fetch(`${CF_API}/zones?per_page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const zonesJson = await zonesRes.json()

    if (!zonesJson.success) {
      await prisma.cfAccount.update({
        where: { id },
        data: { lastTestAt: now, lastTestStatus: "error" },
      })
      return NextResponse.json({
        success: false,
        error: zonesJson.errors?.[0]?.message ?? "Token 无效",
      })
    }

    const zoneId: string | undefined = zonesJson.result?.[0]?.id
    const cfAccountId: string | undefined = zonesJson.result?.[0]?.account?.id

    const permissions: Permission[] = [
      { key: "zone_read", label: "Zone 列表（必需）", status: "ok" },
    ]

    if (zoneId) {
      const [dns, zoneSettings, emailRouting, firewall, workersRoutes, analytics] =
        await Promise.all([
          probe(`${CF_API}/zones/${zoneId}/dns_records?per_page=1`, token),
          probe(`${CF_API}/zones/${zoneId}/settings/ssl`, token),
          probe(`${CF_API}/zones/${zoneId}/email/routing/rules?per_page=1`, token),
          probe(`${CF_API}/zones/${zoneId}/firewall/access_rules/rules?per_page=1`, token),
          probe(`${CF_API}/zones/${zoneId}/workers/routes`, token),
          probe(`${CF_API}/zones/${zoneId}/analytics/dashboard`, token),
        ])
      permissions.push(
        { key: "dns", label: "DNS 管理（必需）", status: dns, cfPermission: "Zone → DNS → 编辑" },
        { key: "zone_settings", label: "Zone 设置", status: zoneSettings, cfPermission: "Zone → 区域设置 → 编辑" },
        { key: "cache_purge", label: "缓存清除", status: "unverified", cfPermission: "Zone → 缓存规则 → 清除", note: "无法安全验证" },
        { key: "email_routing", label: "邮件路由", status: emailRouting, cfPermission: "Zone → 电子邮件路由 → 编辑" },
        { key: "firewall", label: "IP 防火墙", status: firewall, cfPermission: "Zone → 防火墙服务 → 编辑" },
        { key: "workers_routes", label: "Workers 路由", status: workersRoutes, cfPermission: "Zone → Workers 路由 → 读取" },
        { key: "analytics", label: "流量分析", status: analytics, cfPermission: "Zone → 分析 → 读取" },
      )
    } else {
      permissions.push(
        { key: "dns", label: "DNS 管理（必需）", status: "error", cfPermission: "Zone → DNS → 编辑", note: "无可用 Zone" },
        { key: "zone_settings", label: "Zone 设置", status: "error", cfPermission: "Zone → 区域设置 → 编辑", note: "无可用 Zone" },
        { key: "cache_purge", label: "缓存清除", status: "unverified", cfPermission: "Zone → 缓存规则 → 清除", note: "无法安全验证" },
        { key: "email_routing", label: "邮件路由", status: "error", cfPermission: "Zone → 电子邮件路由 → 编辑", note: "无可用 Zone" },
        { key: "firewall", label: "IP 防火墙", status: "error", cfPermission: "Zone → 防火墙服务 → 编辑", note: "无可用 Zone" },
        { key: "workers_routes", label: "Workers 路由", status: "error", cfPermission: "Zone → Workers 路由 → 读取", note: "无可用 Zone" },
        { key: "analytics", label: "流量分析", status: "error", cfPermission: "Zone → 分析 → 读取", note: "无可用 Zone" },
      )
    }

    const bulkRedirectsStatus = cfAccountId
      ? await probe(`${CF_API}/accounts/${cfAccountId}/rules/lists?kind=redirect&per_page=1`, token)
      : ("error" as PermStatus)
    permissions.push({
      key: "bulk_redirects",
      label: "批量重定向（账号级）",
      status: bulkRedirectsStatus,
      cfPermission: "账号 → Lists → 读取",
      ...(cfAccountId ? {} : { note: "无法获取 CF 账号 ID" }),
    })

    const requiredMissing = permissions.some(
      (p) => (p.key === "zone_read" || p.key === "dns") && p.status !== "ok"
    )
    const hasWarning = !requiredMissing && permissions.some((p) => p.status === "missing")
    const overallStatus = requiredMissing ? "error" : hasWarning ? "warning" : "ok"

    await prisma.cfAccount.update({
      where: { id },
      data: { lastTestAt: now, lastTestStatus: overallStatus },
    })

    return NextResponse.json({ success: true, permissions, status: overallStatus })
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

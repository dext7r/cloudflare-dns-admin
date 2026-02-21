"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useZoneContext } from "@/hooks/useZoneContext"
import { AccountSelector } from "@/components/AccountSelector"
import { ZoneSelector } from "@/components/ZoneSelector"

interface ZoneOverviewManagerProps {
  role: "ADMIN" | "VIEWER"
}

interface ZoneSetting {
  id: string
  value: string | number | boolean
}

interface ZoneSettingsData {
  success: boolean
  result: ZoneSetting[]
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

const SSL_COLORS: Record<string, string> = {
  off: "border-red-500/30 text-red-400",
  flexible: "border-amber-500/30 text-amber-400",
  full: "border-blue-500/30 text-blue-400",
  strict: "border-emerald-500/30 text-emerald-400",
}

const SECURITY_COLORS: Record<string, string> = {
  essentially_off: "border-slate-500/30 text-slate-400",
  low: "border-amber-500/30 text-amber-400",
  medium: "border-orange-500/30 text-orange-400",
  high: "border-red-500/30 text-red-400",
  under_attack: "border-red-700/30 text-red-300",
}

const SETTING_LABELS: Record<string, string> = {
  ssl: "SSL 模式",
  always_use_https: "强制 HTTPS",
  security_level: "安全等级",
  brotli: "Brotli 压缩",
  development_mode: "开发模式",
  min_tls_version: "最低 TLS 版本",
}

const SWITCH_SETTINGS = new Set(["always_use_https", "brotli", "development_mode"])

export function ZoneOverviewManager({ role }: ZoneOverviewManagerProps) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [toggling, setToggling] = useState<string | null>(null)

  const settingsUrl =
    zoneId
      ? `/api/cloudflare/zone-settings?zoneId=${zoneId}&accountId=${accountId ?? ""}`
      : null

  const { data, isLoading } = useSWR<ZoneSettingsData>(settingsUrl, fetcher)

  const TARGET_SETTINGS = ["ssl", "always_use_https", "security_level", "brotli", "development_mode", "min_tls_version"]
  const settings = (data?.result ?? []).filter((s) => TARGET_SETTINGS.includes(s.id))

  async function handleToggle(settingId: string, current: string) {
    if (role !== "ADMIN") return
    const next = current === "on" ? "off" : "on"
    setToggling(settingId)
    try {
      const res = await fetch(
        `/api/cloudflare/zone-settings?zoneId=${zoneId}&settingId=${settingId}&accountId=${accountId ?? ""}`,
        { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ value: next }) }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.error || "操作失败")
      toast.success("设置已更新")
      mutate(settingsUrl)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "操作失败")
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center gap-2">
        {accounts.length > 0 && (
          <AccountSelector
            accounts={accounts}
            activeAccountId={accountId}
            onSelect={onAccountChange}
          />
        )}
        <ZoneSelector
          zones={zones}
          activeZoneId={zoneId}
          onSelect={onZoneChange}
          loading={zonesLoading}
        />
      </div>

      {!zoneId ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          请选择域名
        </div>
      ) : isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {settings.map((setting) => {
            const val = String(setting.value)
            const isSwitch = SWITCH_SETTINGS.has(setting.id)
            const isOn = val === "on"

            return (
              <div
                key={setting.id}
                className="rounded-lg border border-border/50 bg-card/50 p-4 flex items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs text-muted-foreground">
                    {SETTING_LABELS[setting.id] ?? setting.id}
                  </span>
                  {isSwitch ? (
                    <span className="text-sm font-medium">{isOn ? "已开启" : "已关闭"}</span>
                  ) : (
                    <Badge
                      variant="outline"
                      className={
                        setting.id === "ssl"
                          ? (SSL_COLORS[val] ?? "")
                          : setting.id === "security_level"
                          ? (SECURITY_COLORS[val] ?? "")
                          : ""
                      }
                    >
                      {val}
                    </Badge>
                  )}
                </div>
                {isSwitch && (
                  <Switch
                    checked={isOn}
                    disabled={role !== "ADMIN" || toggling === setting.id}
                    onCheckedChange={() => handleToggle(setting.id, val)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

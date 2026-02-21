"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { AccountSelector } from "@/components/AccountSelector"
import { ZoneSelector } from "@/components/ZoneSelector"
import { useZoneContext } from "@/hooks/useZoneContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ZoneSetting {
  id: string
  value: unknown
  modified_on: string
}

interface Props {
  role: "ADMIN" | "VIEWER"
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

const SWITCH_SETTINGS = new Set([
  "always_use_https",
  "brotli",
  "development_mode",
  "http3",
  "websockets",
])

const SELECT_OPTIONS: Record<string, { label: string; value: string }[]> = {
  ssl: [
    { label: "Off", value: "off" },
    { label: "Flexible", value: "flexible" },
    { label: "Full", value: "full" },
    { label: "Full (Strict)", value: "strict" },
  ],
  security_level: [
    { label: "Essentially Off", value: "essentially_off" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Under Attack", value: "under_attack" },
  ],
  min_tls_version: [
    { label: "TLS 1.0", value: "1.0" },
    { label: "TLS 1.1", value: "1.1" },
    { label: "TLS 1.2", value: "1.2" },
    { label: "TLS 1.3", value: "1.3" },
  ],
}

const SETTING_LABELS: Record<string, string> = {
  ssl: "SSL 模式",
  always_use_https: "强制 HTTPS",
  security_level: "安全级别",
  brotli: "Brotli 压缩",
  development_mode: "开发模式",
  min_tls_version: "最低 TLS 版本",
  http3: "HTTP/3 (QUIC)",
  websockets: "WebSockets",
}

const VISIBLE_SETTINGS = Object.keys(SETTING_LABELS)

export function ZoneSettingsManager({ role }: Props) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [patching, setPatching] = useState<string | null>(null)

  const settingsUrl =
    zoneId ? `/api/cloudflare/zone-settings?zoneId=${zoneId}&accountId=${accountId ?? ""}` : null

  const { data, isLoading, mutate } = useSWR<{ success: boolean; result: ZoneSetting[] }>(
    settingsUrl,
    fetcher
  )

  const settingsMap = Object.fromEntries((data?.result ?? []).map((s) => [s.id, s]))

  async function patch(settingId: string, value: unknown) {
    if (!zoneId) return
    setPatching(settingId)
    try {
      const res = await fetch(
        `/api/cloudflare/zone-settings?zoneId=${zoneId}&settingId=${settingId}&accountId=${accountId ?? ""}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.error || "操作失败")
      toast.success("设置已更新")
      mutate()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "操作失败")
    } finally {
      setPatching(null)
    }
  }

  const disabled = role !== "ADMIN"

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 flex-wrap">
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
        <p className="text-sm text-muted-foreground">请先选择域名</p>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">加载设置...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>设置项</TableHead>
              <TableHead>当前值</TableHead>
              <TableHead className="w-[220px]">控制</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {VISIBLE_SETTINGS.map((id) => {
              const setting = settingsMap[id]
              const currentValue = setting?.value
              const isPending = patching === id

              return (
                <TableRow key={id}>
                  <TableCell className="font-medium text-sm">{SETTING_LABELS[id]}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {currentValue !== undefined ? String(currentValue) : "—"}
                  </TableCell>
                  <TableCell>
                    {SWITCH_SETTINGS.has(id) ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={currentValue === "on"}
                          disabled={disabled || isPending || !setting}
                          onCheckedChange={(checked) => patch(id, checked ? "on" : "off")}
                        />
                        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                      </div>
                    ) : SELECT_OPTIONS[id] ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={typeof currentValue === "string" ? currentValue : ""}
                          onValueChange={(v) => patch(id, v)}
                          disabled={disabled || isPending || !setting}
                        >
                          <SelectTrigger className="h-8 w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SELECT_OPTIONS[id].map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

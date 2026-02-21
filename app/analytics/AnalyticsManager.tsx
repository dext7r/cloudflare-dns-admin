"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useZoneContext } from "@/hooks/useZoneContext"
import { AccountSelector } from "@/components/AccountSelector"
import { ZoneSelector } from "@/components/ZoneSelector"

interface AnalyticsManagerProps {
  role: "ADMIN" | "VIEWER"
}

type Range = "24h" | "7d" | "30d"

interface Totals {
  requests: { all: number }
  bandwidth: { all: number }
  threats: { all: number }
  pageviews: { all: number }
  uniques: { all: number }
}

interface Timeseries {
  since: string
  requests: { all: number }
}

interface AnalyticsData {
  success: boolean
  result: {
    totals: Totals
    timeseries: Timeseries[]
  }
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${bytes} B`
}

function getRangeParams(range: Range): { since: string; until: string } {
  const until = new Date()
  const since = new Date(until)
  if (range === "24h") since.setHours(since.getHours() - 24)
  else if (range === "7d") since.setDate(since.getDate() - 7)
  else since.setDate(since.getDate() - 30)
  return { since: since.toISOString(), until: until.toISOString() }
}

const RANGE_LABELS: Record<Range, string> = { "24h": "24 小时", "7d": "7 天", "30d": "30 天" }

export function AnalyticsManager({ role: _role }: AnalyticsManagerProps) {
  const { accountId, zoneId, accounts, zones, zonesLoading, onAccountChange, onZoneChange } =
    useZoneContext()
  const [range, setRange] = useState<Range>("24h")
  const { since, until } = useMemo(() => getRangeParams(range), [range])

  const analyticsUrl =
    zoneId
      ? `/api/cloudflare/analytics?zoneId=${zoneId}&accountId=${accountId ?? ""}&since=${since}&until=${until}`
      : null

  const { data, isLoading, error } = useSWR<AnalyticsData>(analyticsUrl, fetcher)

  const totals = data?.result?.totals
  const timeseries = data?.result?.timeseries ?? []
  const isPlanError =
    error?.message?.includes("403") ||
    error?.message?.includes("analytics") ||
    error?.message?.includes("套餐")

  const STAT_CARDS = totals
    ? [
        { label: "总请求", value: totals.requests.all.toLocaleString() },
        { label: "总流量", value: formatBytes(totals.bandwidth.all) },
        { label: "威胁数", value: totals.threats.all.toLocaleString() },
        { label: "页面访问", value: totals.pageviews.all.toLocaleString() },
        { label: "独立访客", value: totals.uniques.all.toLocaleString() },
      ]
    : []

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
        <div className="flex items-center gap-1 ml-auto">
          {(["24h", "7d", "30d"] as Range[]).map((r) => (
            <Button
              key={r}
              variant="outline"
              size="sm"
              className={cn(
                "h-8 px-3 text-xs border-border/50",
                range === r && "bg-accent text-accent-foreground"
              )}
              onClick={() => setRange(r)}
            >
              {RANGE_LABELS[r]}
            </Button>
          ))}
        </div>
      </div>

      {!zoneId ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          请选择域名
        </div>
      ) : isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : isPlanError || error ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {isPlanError ? "该套餐不支持 Analytics API" : (error?.message ?? "加载失败")}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                className="rounded-lg border border-border/50 bg-card/50 p-4 flex flex-col gap-1"
              >
                <span className="text-xs text-muted-foreground">{card.label}</span>
                <span className="text-xl font-semibold tracking-tight">{card.value}</span>
              </div>
            ))}
          </div>

          {timeseries.length > 0 ? (
            <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-2.5 text-left text-xs text-muted-foreground font-medium">
                      时间
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs text-muted-foreground font-medium">
                      请求数
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timeseries.map((row, i) => (
                    <tr
                      key={row.since}
                      className={cn(
                        "border-b border-border/30 last:border-0",
                        i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                      )}
                    >
                      <td className="px-4 py-2 text-muted-foreground">
                        {new Date(row.since).toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {row.requests.all.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-sm text-muted-foreground">
              该时间段内暂无流量数据
            </div>
          )}
        </>
      )}
    </div>
  )
}

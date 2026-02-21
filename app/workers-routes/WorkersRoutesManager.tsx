"use client"

import useSWR from "swr"
import { Loader2, Info, Copy, Check } from "lucide-react"
import { useState } from "react"
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
import type { WorkerRoute } from "@/lib/cloudflare"

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <span>{id.slice(0, 8)}…</span>
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

export function WorkersRoutesManager({ role: _role }: { role: "ADMIN" | "VIEWER" }) {
  const {
    accountId,
    zoneId,
    accounts,
    zones,
    zonesLoading,
    onAccountChange,
    onZoneChange,
  } = useZoneContext()

  const url =
    zoneId
      ? `/api/cloudflare/workers-routes?zoneId=${zoneId}&accountId=${accountId ?? ""}`
      : null

  const { data, isLoading, error } = useSWR<{ success: boolean; result: WorkerRoute[] }>(
    url,
    fetcher
  )

  const routes = data?.result ?? []

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

      <div className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Workers 路由为只读视图，如需修改请前往 Cloudflare 控制台</span>
      </div>

      {!zoneId ? (
        <p className="text-sm text-muted-foreground">请选择域名以查看 Workers 路由</p>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">加载中...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">加载失败：{error.message}</p>
      ) : routes.length === 0 ? (
        <p className="text-sm text-muted-foreground">该域名未绑定任何 Workers 路由</p>
      ) : (
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>路由模式</TableHead>
                <TableHead>Worker 脚本</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-mono text-xs">{route.pattern}</TableCell>
                  <TableCell className="text-sm">
                    {route.script || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <CopyableId id={route.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

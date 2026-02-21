"use client"

import useSWR from "swr"
import { Loader2, Info } from "lucide-react"
import { AccountSelector } from "@/components/AccountSelector"
import { useZoneContext } from "@/hooks/useZoneContext"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RedirectList {
  id: string
  name: string
  kind: string
  num_items: number
  num_referencing_filters: number
  description?: string
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function RedirectsManager({ role }: { role: "ADMIN" | "VIEWER" }) {
  const { accountId, accounts, onAccountChange } = useZoneContext()

  const noAccounts = accounts.length === 0
  const url =
    accountId !== null || noAccounts
      ? `/api/cloudflare/redirects?accountId=${accountId ?? ""}`
      : null

  const { data, isLoading, error } = useSWR<{ success: boolean; result: RedirectList[] }>(
    url,
    fetcher
  )

  const lists = data?.result ?? []

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
      </div>

      <div className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>批量重定向列表为只读视图，如需修改请前往 Cloudflare 控制台</span>
      </div>

      {accountId === null && !noAccounts ? (
        <p className="text-sm text-muted-foreground">请选择账号</p>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">加载中...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">加载失败：{error.message}</p>
      ) : lists.length === 0 ? (
        <p className="text-sm text-muted-foreground">未找到批量重定向列表</p>
      ) : (
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>列表名称</TableHead>
                <TableHead>规则数量</TableHead>
                <TableHead>描述</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell className="text-sm font-medium">{list.name}</TableCell>
                  <TableCell className="text-sm">{list.num_items}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {list.description || <span className="text-muted-foreground/50">—</span>}
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

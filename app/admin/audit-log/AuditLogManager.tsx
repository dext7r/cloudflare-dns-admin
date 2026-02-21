"use client"

import { useState } from "react"
import useSWR from "swr"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

interface AuditLog {
  id: string
  userId: string
  userEmail: string
  action: string
  zoneId?: string
  zoneName?: string
  target?: string
  before?: unknown
  after?: unknown
  createdAt: string
}

interface AuditLogResponse {
  success: boolean
  result: AuditLog[]
  total: number
  page: number
  pageSize: number
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

const ACTION_COLORS: Record<string, string> = {
  "dns.create": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "dns.update": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "dns.delete": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "dns.batch_delete": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const ACTION_LABELS: Record<string, string> = {
  "dns.create": "创建",
  "dns.update": "更新",
  "dns.delete": "删除",
  "dns.batch_delete": "批量删除",
}

const PAGE_SIZE = 50

function DetailDialog({ log }: { log: AuditLog }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
          详情
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>操作详情</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
            <span>用户：<span className="text-foreground">{log.userEmail}</span></span>
            <span>操作：<span className="text-foreground">{ACTION_LABELS[log.action] ?? log.action}</span></span>
            {log.zoneName && <span>域名：<span className="text-foreground">{log.zoneName}</span></span>}
            {log.target && <span>目标：<span className="text-foreground">{log.target}</span></span>}
            <span className="col-span-2">时间：<span className="text-foreground">{new Date(log.createdAt).toLocaleString("zh-CN")}</span></span>
          </div>
          {log.before !== undefined && (
            <div className="space-y-1">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">变更前</p>
              <pre className="bg-muted/50 rounded-md p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(log.before, null, 2)}
              </pre>
            </div>
          )}
          {log.after !== undefined && (
            <div className="space-y-1">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">变更后</p>
              <pre className="bg-muted/50 rounded-md p-3 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                {JSON.stringify(log.after, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AuditLogManager() {
  const [page, setPage] = useState(1)
  const [emailFilter, setEmailFilter] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
  if (emailFilter.trim()) params.set("userEmail", emailFilter.trim())
  if (actionFilter !== "all") params.set("action", actionFilter)

  const { data, isLoading } = useSWR<AuditLogResponse>(
    `/api/admin/audit-log?${params.toString()}`,
    fetcher
  )

  const logs = data?.result ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function handleEmailChange(v: string) {
    setEmailFilter(v)
    setPage(1)
  }

  function handleActionChange(v: string) {
    setActionFilter(v)
    setPage(1)
  }

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="按邮箱筛选"
          value={emailFilter}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="h-8 w-52 text-sm"
        />
        <Select value={actionFilter} onValueChange={handleActionChange}>
          <SelectTrigger className="h-8 w-40 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部操作</SelectItem>
            <SelectItem value="dns.create">创建</SelectItem>
            <SelectItem value="dns.update">更新</SelectItem>
            <SelectItem value="dns.delete">删除</SelectItem>
            <SelectItem value="dns.batch_delete">批量删除</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          加载中...
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[160px]">时间</TableHead>
                <TableHead>用户</TableHead>
                <TableHead className="w-[110px]">操作</TableHead>
                <TableHead>域名</TableHead>
                <TableHead>目标</TableHead>
                <TableHead className="w-[60px]">
                  <span className="sr-only">详情</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                    暂无操作记录
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-sm">{log.userEmail}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs font-medium border-0 ${ACTION_COLORS[log.action] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {ACTION_LABELS[log.action] ?? log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.zoneName ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-xs max-w-[200px] truncate">
                      {log.target ?? "—"}
                    </TableCell>
                    <TableCell>
                      {(log.before !== undefined || log.after !== undefined) && (
                        <DetailDialog log={log} />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>第 {page} 页，共 {total} 条</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

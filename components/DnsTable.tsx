"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  RECORD_TYPE_COLORS,
  formatTtl,
  type DnsRecord,
} from "@/lib/dns-types"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Cloud,
  CloudOff,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DnsTableProps {
  records: DnsRecord[]
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onEdit: (record: DnsRecord) => void
  onDelete: (record: DnsRecord) => void
  onToggleProxy: (record: DnsRecord) => void
  loading?: boolean
  readonly?: boolean
  protectedZone?: boolean
  page?: number
  totalPages?: number
  total?: number
  onPageChange?: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
}

export function DnsTable({
  records,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  onToggleProxy,
  loading,
  readonly,
  protectedZone,
  page,
  totalPages,
  total,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: DnsTableProps) {
  const canDelete = !readonly && !protectedZone
  const allSelected = records.length > 0 && selectedIds.size === records.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < records.length

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(records.map((r) => r.id)))
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onSelectionChange(next)
  }

  function truncateContent(content: string, maxLen = 48) {
    if (content.length <= maxLen) return content
    return content.slice(0, maxLen) + "..."
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>加载 DNS 记录...</span>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <CloudOff className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm">未找到 DNS 记录</p>
        <p className="text-xs mt-1">添加一条新记录或调整筛选条件</p>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[44px]">
                {canDelete && (
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) {
                        const input = el.querySelector("button")
                        if (input) {
                          input.dataset.indeterminate = String(someSelected)
                        }
                      }
                    }}
                    onCheckedChange={toggleAll}
                    aria-label="全选"
                  />
                )}
              </TableHead>
              <TableHead className="w-[80px]">类型</TableHead>
              <TableHead className="min-w-[180px]">名称</TableHead>
              <TableHead className="min-w-[200px]">内容</TableHead>
              <TableHead className="w-[80px]">代理</TableHead>
              <TableHead className="w-[80px]">TTL</TableHead>
              <TableHead className="w-[48px]">
                <span className="sr-only">操作</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record.id}
                className={cn(
                  "group transition-colors",
                  !readonly && !protectedZone && selectedIds.has(record.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  {canDelete && (
                    <Checkbox
                      checked={selectedIds.has(record.id)}
                      onCheckedChange={() => toggleOne(record.id)}
                      aria-label={`选择 ${record.name}`}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-mono font-semibold border",
                      RECORD_TYPE_COLORS[record.type]
                    )}
                  >
                    {record.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyToClipboard(record.name)}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors text-left truncate max-w-[240px] block"
                      >
                        {record.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">点击复制</p>
                    </TooltipContent>
                  </Tooltip>
                  {record.comment && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[240px]">
                      {record.comment}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => copyToClipboard(record.content)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono text-left truncate max-w-[280px] block"
                      >
                        {truncateContent(record.content)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[400px]">
                      <p className="text-xs break-all">{record.content}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {record.proxiable ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            checked={record.proxied}
                            onCheckedChange={() => !readonly && !protectedZone && onToggleProxy(record)}
                            disabled={readonly || !!protectedZone}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {record.proxied ? "已代理" : "仅 DNS"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Cloud className="h-4 w-4 text-muted-foreground/40" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">不支持代理</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatTtl(record.ttl)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作菜单</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!readonly && !protectedZone && (
                        <DropdownMenuItem onClick={() => onEdit(record)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => copyToClipboard(record.content)}>
                        <Copy className="mr-2 h-4 w-4" />
                        复制内容
                      </DropdownMenuItem>
                      {canDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(record)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
      {onPageSizeChange !== undefined && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50">
          {totalPages && totalPages > 1 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault()
                      if (page && page > 1) onPageChange?.(page - 1)
                    }}
                    className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-xs text-muted-foreground px-2">
                    {page} / {totalPages} 页（{total} 条）
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault()
                      if (page && page < totalPages) onPageChange?.(page + 1)
                    }}
                    className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : (
            <span className="text-xs text-muted-foreground">共 {total ?? 0} 条</span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            每页
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-6 rounded border border-input bg-background px-1.5 text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {[5, 10, 20, 50, 100, 500, 1000].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            条
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}

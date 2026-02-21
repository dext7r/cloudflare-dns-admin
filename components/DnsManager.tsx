"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR, { mutate as globalMutate } from "swr"
import { toast } from "sonner"
import { ZoneSelector } from "@/components/ZoneSelector"
import { DnsFilters } from "@/components/DnsFilters"
import { DnsTable } from "@/components/DnsTable"
import { DnsRecordForm } from "@/components/DnsRecordForm"
import { DnsBatchActions } from "@/components/DnsBatchActions"
import { DnsImportDialog } from "@/components/DnsImportExport"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type {
  Zone,
  DnsRecord,
  DnsRecordType,
  CreateDnsRecordRequest,
} from "@/lib/dns-types"
import {
  Plus,
  Download,
  Upload,
  RefreshCw,
  Shield,
  AlertTriangle,
} from "lucide-react"

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function DnsManager() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<DnsRecord | null>(null)
  const [batchLoading, setBatchLoading] = useState(false)
  const [filters, setFilters] = useState<{
    type?: DnsRecordType
    search: string
  }>({ search: "" })

  // 获取 Zone 列表
  const {
    data: zonesData,
    error: zonesError,
    isLoading: zonesLoading,
  } = useSWR<{ success: boolean; result: Zone[] }>(
    "/api/cloudflare/zones",
    fetcher
  )

  const zones = zonesData?.result || []

  // 自动选中第一个 zone
  useEffect(() => {
    if (zones.length > 0 && !activeZoneId) {
      setActiveZoneId(zones[0].id)
    }
  }, [zones, activeZoneId])

  // 构建 DNS 记录查询 URL
  const dnsUrl = activeZoneId
    ? `/api/cloudflare/dns?zoneId=${activeZoneId}&per_page=200${
        filters.type ? `&type=${filters.type}` : ""
      }${filters.search ? `&name=${filters.search}` : ""}`
    : null

  // 获取 DNS 记录
  const {
    data: dnsData,
    error: dnsError,
    isLoading: dnsLoading,
  } = useSWR<{ success: boolean; records: DnsRecord[]; total: number }>(
    dnsUrl,
    fetcher
  )

  const records = dnsData?.records || []
  const totalCount = dnsData?.total || 0

  // 本地搜索过滤（对 content 做客户端过滤）
  const filteredRecords = filters.search
    ? records.filter(
        (r) =>
          r.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.content.toLowerCase().includes(filters.search.toLowerCase())
      )
    : records

  const activeZone = zones.find((z) => z.id === activeZoneId)

  const handleFilterChange = useCallback(
    (f: { type?: DnsRecordType; search: string }) => {
      setFilters(f)
    },
    []
  )

  function refreshRecords() {
    if (dnsUrl) {
      globalMutate(dnsUrl)
    }
  }

  async function handleCreateOrUpdate(data: CreateDnsRecordRequest) {
    if (editRecord) {
      const res = await fetch(`/api/cloudflare/dns/${editRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId: activeZoneId, ...data }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("DNS 记录已更新")
    } else {
      const res = await fetch("/api/cloudflare/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId: activeZoneId, ...data }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("DNS 记录已创建")
    }
    setEditRecord(null)
    refreshRecords()
  }

  async function handleDelete(record: DnsRecord) {
    if (!confirm(`确定要删除记录 "${record.name}" (${record.type}) 吗？`)) return
    try {
      const res = await fetch(
        `/api/cloudflare/dns/${record.id}?zoneId=${activeZoneId}`,
        { method: "DELETE" }
      )
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("DNS 记录已删除")
      refreshRecords()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "删除失败")
    }
  }

  async function handleToggleProxy(record: DnsRecord) {
    try {
      const res = await fetch(`/api/cloudflare/dns/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: activeZoneId,
          type: record.type,
          name: record.name,
          content: record.content,
          ttl: record.ttl,
          proxied: !record.proxied,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(
        record.proxied ? "已切换为仅 DNS" : "已启用 Cloudflare 代理"
      )
      refreshRecords()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "切换代理状态失败")
    }
  }

  async function handleBatchDelete() {
    setBatchLoading(true)
    try {
      const res = await fetch("/api/cloudflare/dns/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: activeZoneId,
          recordIds: Array.from(selectedIds),
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(`成功删除 ${json.deleted} 条记录`)
      setSelectedIds(new Set())
      refreshRecords()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "批量删除失败")
    } finally {
      setBatchLoading(false)
    }
  }

  async function handleExport() {
    try {
      const res = await fetch(
        `/api/cloudflare/dns/export?zoneId=${activeZoneId}`
      )
      if (!res.ok) throw new Error("导出失败")
      const content = await res.text()
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${activeZone?.name || "dns"}_records.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("DNS 记录已导出")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "导出失败")
    }
  }

  async function handleImport(content: string) {
    const res = await fetch("/api/cloudflare/dns/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneId: activeZoneId, content }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)
    toast.success(
      `导入完成: 新增 ${json.result.recs_added} 条（共解析 ${json.result.total_records_parsed} 条）`
    )
    refreshRecords()
  }

  function handleEdit(record: DnsRecord) {
    setEditRecord(record)
    setFormOpen(true)
  }

  function handleZoneChange(zoneId: string) {
    setActiveZoneId(zoneId)
    setSelectedIds(new Set())
  }

  const hasError = zonesError || dnsError

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  Cloudflare DNS
                </h1>
                <p className="text-xs text-muted-foreground">
                  DNS 记录管理系统
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeZoneId && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshRecords}
                    className="h-8"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="sr-only">刷新</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportOpen(true)}
                    className="h-8"
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    导入
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExport}
                    className="h-8"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    导出
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditRecord(null)
                      setFormOpen(true)
                    }}
                    className="h-8"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    添加记录
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
        {/* 错误提示 */}
        {hasError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive-foreground">
                连接失败
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {zonesError?.message || dnsError?.message || "无法连接到 Cloudflare API，请检查 API Token 配置"}
              </p>
            </div>
          </div>
        )}

        {/* Zone 选择器 */}
        <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
          <ZoneSelector
            zones={zones}
            activeZoneId={activeZoneId}
            onSelect={handleZoneChange}
            loading={zonesLoading}
          />
        </div>

        {/* 操作栏: 筛选 + 统计 */}
        {activeZoneId && (
          <div className="flex items-center justify-between gap-4">
            <DnsFilters onFilterChange={handleFilterChange} />
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-xs">
                {filteredRecords.length} / {totalCount} 条记录
              </Badge>
            </div>
          </div>
        )}

        <Separator className="opacity-30" />

        {/* 批量操作工具栏 */}
        <DnsBatchActions
          selectedCount={selectedIds.size}
          onBatchDelete={handleBatchDelete}
          onClearSelection={() => setSelectedIds(new Set())}
          loading={batchLoading}
        />

        {/* DNS 记录表格 */}
        {activeZoneId && (
          <DnsTable
            records={filteredRecords}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleProxy={handleToggleProxy}
            loading={dnsLoading}
          />
        )}
      </main>

      {/* 创建/编辑表单 */}
      <DnsRecordForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditRecord(null)
        }}
        onSubmit={handleCreateOrUpdate}
        editRecord={editRecord}
        zoneName={activeZone?.name}
      />

      {/* 导入对话框 */}
      <DnsImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </div>
  )
}

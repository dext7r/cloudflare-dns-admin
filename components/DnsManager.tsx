"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR, { mutate as globalMutate } from "swr"
import { toast } from "sonner"
import { ZoneSelector } from "@/components/ZoneSelector"
import { AccountSelector } from "@/components/AccountSelector"
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
import { Plus, Download, Upload, RefreshCw, AlertTriangle } from "lucide-react"

interface DnsManagerProps {
  role: "ADMIN" | "VIEWER"
  protectedZones?: string[]
}

interface CfAccount {
  id: string
  name: string
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error("请求失败")
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "操作失败")
  return data
}

export function DnsManager({ role, protectedZones = [] }: DnsManagerProps) {
  const isAdmin = role === "ADMIN"

  const [accountId, setAccountId] = useState<string | null>(null)
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<DnsRecord | null>(null)
  const [batchLoading, setBatchLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [filters, setFilters] = useState<{
    type?: DnsRecordType
    search: string
  }>({ search: "" })

  const { data: accountsData } = useSWR<{ success: boolean; result: CfAccount[] }>(
    "/api/admin/cf-accounts",
    fetcher
  )
  const cfAccounts = accountsData?.result || []
  const accountsReady = !!accountsData
  const noAccounts = accountsReady && cfAccounts.length === 0

  // 仅当已选账号或无 DB 账号（回退到环境变量）时才拉取 Zone 列表
  const zonesUrl = (accountId !== null || noAccounts)
    ? `/api/cloudflare/zones?accountId=${accountId ?? ""}`
    : null
  const {
    data: zonesData,
    error: zonesError,
    isLoading: zonesLoading,
  } = useSWR<{ success: boolean; result: Zone[] }>(zonesUrl, fetcher)

  const zones = zonesData?.result || []

  useEffect(() => {
    if (zones.length > 0 && !activeZoneId) {
      setActiveZoneId(zones[0].id)
    }
  }, [zones, activeZoneId])

  const dnsUrl = activeZoneId
    ? `/api/cloudflare/dns?zoneId=${activeZoneId}&page=${page}&per_page=${pageSize}${
        filters.type ? `&type=${filters.type}` : ""
      }${filters.search ? `&name=${filters.search}` : ""}&accountId=${accountId ?? ""}`
    : null

  const {
    data: dnsData,
    error: dnsError,
    isLoading: dnsLoading,
  } = useSWR<{
    success: boolean
    records: DnsRecord[]
    total: number
    totalPages?: number
  }>(dnsUrl, fetcher)

  const records = dnsData?.records || []
  const totalCount = dnsData?.total || 0
  const activeZone = zones.find((z) => z.id === activeZoneId)
  const isProtectedZone = !!activeZone && protectedZones.includes(activeZone.name)

  const handleFilterChange = useCallback(
    (f: { type?: DnsRecordType; search: string }) => {
      setFilters(f)
      setPage(1)
    },
    []
  )

  function refreshRecords() {
    if (!activeZoneId) return
    const zonePrefix = `/api/cloudflare/dns?zoneId=${activeZoneId}&`
    void globalMutate(
      (key: unknown) => typeof key === "string" && key.startsWith(zonePrefix),
      undefined,
      { revalidate: true }
    )
  }

  function handleAccountChange(id: string | null) {
    setAccountId(id)
    setActiveZoneId(null)
    setSelectedIds(new Set())
    setPage(1)
  }

  async function handleCreateOrUpdate(data: CreateDnsRecordRequest) {
    if (editRecord) {
      const res = await fetch(`/api/cloudflare/dns/${editRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId: activeZoneId, accountId, ...data }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success("DNS 记录已更新")
    } else {
      const res = await fetch("/api/cloudflare/dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId: activeZoneId, accountId, ...data }),
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
      const qs = `zoneId=${activeZoneId}&accountId=${accountId ?? ""}`
      const res = await fetch(`/api/cloudflare/dns/${record.id}?${qs}`, { method: "DELETE" })
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
          accountId,
          type: record.type,
          name: record.name,
          content: record.content,
          ttl: record.ttl,
          proxied: !record.proxied,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      toast.success(record.proxied ? "已切换为仅 DNS" : "已启用 Cloudflare 代理")
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
          accountId,
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
      const qs = `zoneId=${activeZoneId}&accountId=${accountId ?? ""}`
      const res = await fetch(`/api/cloudflare/dns/export?${qs}`)
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
      body: JSON.stringify({ zoneId: activeZoneId, accountId, content }),
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
    setPage(1)
  }

  const hasError = zonesError || dnsError

  return (
    <div className="px-6 py-5 space-y-5 max-w-7xl mx-auto">
      {/* Page toolbar */}
      <div className="flex items-center justify-between gap-4 min-h-[2rem]">
        <div className="flex items-center gap-2">
          {activeZoneId && (
            <Badge variant="secondary" className="text-xs">
              {records.length} / {totalCount} 条记录
            </Badge>
          )}
        </div>
        {activeZoneId && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshRecords} className="h-8">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">刷新</span>
            </Button>
            {isAdmin && !isProtectedZone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportOpen(true)}
                className="h-8 hidden sm:flex"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="ml-1.5">导入</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-8 hidden sm:flex"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="ml-1.5">导出</span>
            </Button>
            {isAdmin && !isProtectedZone && (
              <Button
                size="sm"
                onClick={() => {
                  setEditRecord(null)
                  setFormOpen(true)
                }}
                className="h-8"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">添加记录</span>
                <span className="sm:hidden">添加</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive-foreground">连接失败</p>
            <p className="text-xs text-muted-foreground mt-1">
              {zonesError?.message || dnsError?.message || "无法连接到 Cloudflare API，请检查 API Token 配置"}
            </p>
          </div>
        </div>
      )}

      {cfAccounts.length > 0 && (
        <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3 flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0">账号</span>
          <AccountSelector
            accounts={cfAccounts}
            activeAccountId={accountId}
            onSelect={handleAccountChange}
          />
        </div>
      )}

      <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
        <ZoneSelector
          zones={zones}
          activeZoneId={activeZoneId}
          onSelect={handleZoneChange}
          loading={zonesLoading}
        />
      </div>

      {activeZoneId && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <DnsFilters onFilterChange={handleFilterChange} />
        </div>
      )}

      <Separator className="opacity-30" />

      {isAdmin && (
        <DnsBatchActions
          selectedCount={selectedIds.size}
          onBatchDelete={handleBatchDelete}
          onClearSelection={() => setSelectedIds(new Set())}
          loading={batchLoading}
        />
      )}

      {activeZoneId && (
        <DnsTable
          records={records}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleProxy={handleToggleProxy}
          loading={dnsLoading}
          page={page}
          totalPages={dnsData?.totalPages}
          total={totalCount}
          onPageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          readonly={!isAdmin}
          protectedZone={isProtectedZone}
        />
      )}

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

      <DnsImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImport}
      />
    </div>
  )
}

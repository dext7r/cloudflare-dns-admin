"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_RECORD_TYPES, type DnsRecordType } from "@/lib/dns-types"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DnsFiltersProps {
  onFilterChange: (filters: {
    type?: DnsRecordType
    search: string
  }) => void
}

export function DnsFilters({ onFilterChange }: DnsFiltersProps) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState<string>("all")

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        type: type === "all" ? undefined : (type as DnsRecordType),
        search,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, type, onFilterChange])

  const hasFilters = search !== "" || type !== "all"

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="搜索名称或内容..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background/50 border-border/50 h-9"
        />
      </div>
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[140px] bg-background/50 border-border/50 h-9">
          <SelectValue placeholder="记录类型" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          {ALL_RECORD_TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 text-muted-foreground"
          onClick={() => {
            setSearch("")
            setType("all")
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">清除筛选</span>
        </Button>
      )}
    </div>
  )
}

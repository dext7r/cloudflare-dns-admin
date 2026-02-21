// Cloudflare DNS 管理系统 - 类型定义

export type DnsRecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "MX"
  | "TXT"
  | "NS"
  | "SRV"
  | "CAA"
  | "LOC"
  | "NAPTR"
  | "SMIMEA"
  | "SSHFP"
  | "TLSA"
  | "URI"

export interface Zone {
  id: string
  name: string
  status: "active" | "pending" | "initializing" | "moved" | "deleted" | "deactivated"
  paused: boolean
  type: string
  name_servers: string[]
  created_on: string
  modified_on: string
}

export interface DnsRecord {
  id: string
  zone_id: string
  zone_name: string
  name: string
  type: DnsRecordType
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number
  priority?: number
  locked: boolean
  data?: Record<string, unknown>
  meta: {
    auto_added: boolean
    source?: string
  }
  comment?: string
  tags?: string[]
  created_on: string
  modified_on: string
}

// SRV 记录的 data 字段
export interface SrvData {
  service: string
  proto: string
  name: string
  priority: number
  weight: number
  port: number
  target: string
}

// CAA 记录的 data 字段
export interface CaaData {
  flags: number
  tag: "issue" | "issuewild" | "iodef"
  value: string
}

// LOC 记录的 data 字段
export interface LocData {
  lat_degrees: number
  lat_minutes: number
  lat_seconds: number
  lat_direction: "N" | "S"
  long_degrees: number
  long_minutes: number
  long_seconds: number
  long_direction: "E" | "W"
  altitude: number
  size: number
  precision_horz: number
  precision_vert: number
}

// NAPTR 记录的 data 字段
export interface NaptrData {
  order: number
  preference: number
  flags: string
  service: string
  regex: string
  replacement: string
}

// SSHFP 记录的 data 字段
export interface SshfpData {
  algorithm: number
  type: number
  fingerprint: string
}

// TLSA 记录的 data 字段
export interface TlsaData {
  usage: number
  selector: number
  matching_type: number
  certificate: string
}

// SMIMEA 记录的 data 字段
export interface SmimeaData {
  usage: number
  selector: number
  matching_type: number
  certificate: string
}

// URI 记录的 data 字段
export interface UriData {
  target: string
  weight: number
  priority: number
}

// API 请求类型
export interface CreateDnsRecordRequest {
  type: DnsRecordType
  name: string
  content: string
  ttl: number
  proxied?: boolean
  priority?: number
  data?: Record<string, unknown>
  comment?: string
}

export interface UpdateDnsRecordRequest extends CreateDnsRecordRequest {
  id: string
}

// API 响应类型
export interface CloudflareApiResponse<T> {
  success: boolean
  errors: Array<{ code: number; message: string }>
  messages: Array<{ code: number; message: string }>
  result: T
  result_info?: {
    page: number
    per_page: number
    total_pages: number
    count: number
    total_count: number
  }
}

// 筛选参数
export interface DnsRecordFilters {
  type?: DnsRecordType
  name?: string
  content?: string
  page?: number
  per_page?: number
  order?: "type" | "name" | "content" | "ttl" | "proxied"
  direction?: "asc" | "desc"
}

// 记录类型配色映射
export const RECORD_TYPE_COLORS: Record<DnsRecordType, string> = {
  A: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  AAAA: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  CNAME: "bg-green-500/15 text-green-400 border-green-500/20",
  MX: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  TXT: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  NS: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  SRV: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  CAA: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  LOC: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  NAPTR: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  SMIMEA: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  SSHFP: "bg-lime-500/15 text-lime-400 border-lime-500/20",
  TLSA: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20",
  URI: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
}

// 所有支持的记录类型
export const ALL_RECORD_TYPES: DnsRecordType[] = [
  "A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA",
  "LOC", "NAPTR", "SMIMEA", "SSHFP", "TLSA", "URI",
]

// TTL 选项
export const TTL_OPTIONS = [
  { value: 1, label: "自动" },
  { value: 60, label: "1 分钟" },
  { value: 120, label: "2 分钟" },
  { value: 300, label: "5 分钟" },
  { value: 600, label: "10 分钟" },
  { value: 900, label: "15 分钟" },
  { value: 1800, label: "30 分钟" },
  { value: 3600, label: "1 小时" },
  { value: 7200, label: "2 小时" },
  { value: 18000, label: "5 小时" },
  { value: 43200, label: "12 小时" },
  { value: 86400, label: "1 天" },
]

export function formatTtl(ttl: number): string {
  if (ttl === 1) return "自动"
  const option = TTL_OPTIONS.find((o) => o.value === ttl)
  if (option) return option.label
  if (ttl < 60) return `${ttl} 秒`
  if (ttl < 3600) return `${Math.floor(ttl / 60)} 分钟`
  if (ttl < 86400) return `${Math.floor(ttl / 3600)} 小时`
  return `${Math.floor(ttl / 86400)} 天`
}

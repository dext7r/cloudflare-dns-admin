// Cloudflare API v4 封装

import type {
  CloudflareApiResponse,
  Zone,
  DnsRecord,
  CreateDnsRecordRequest,
  DnsRecordFilters,
} from "./dns-types"

const CF_API_BASE = "https://api.cloudflare.com/client/v4"

function getToken(): string {
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!token) {
    throw new Error("CLOUDFLARE_API_TOKEN 环境变量未设置")
  }
  return token
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  }
}

async function cfFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<CloudflareApiResponse<T>> {
  const url = `${CF_API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers(),
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.text()
    let parsed: { errors?: Array<{ message: string }> } | null = null
    try {
      parsed = JSON.parse(body)
    } catch {}
    const message =
      parsed?.errors?.[0]?.message || `Cloudflare API 错误: ${res.status}`
    throw new Error(message)
  }

  return res.json()
}

// Zone 操作
export async function listZones(): Promise<Zone[]> {
  const response = await cfFetch<Zone[]>("/zones?per_page=50&status=active")
  return response.result
}

// DNS 记录操作
export async function listDnsRecords(
  zoneId: string,
  filters?: DnsRecordFilters
): Promise<{ records: DnsRecord[]; total: number }> {
  const params = new URLSearchParams()
  params.set("per_page", String(filters?.per_page || 100))
  params.set("page", String(filters?.page || 1))
  if (filters?.type) params.set("type", filters.type)
  if (filters?.name) params.set("name", filters.name)
  if (filters?.content) params.set("content", filters.content)
  if (filters?.order) params.set("order", filters.order)
  if (filters?.direction) params.set("direction", filters.direction)

  const response = await cfFetch<DnsRecord[]>(
    `/zones/${zoneId}/dns_records?${params.toString()}`
  )
  return {
    records: response.result,
    total: response.result_info?.total_count || response.result.length,
  }
}

export async function createDnsRecord(
  zoneId: string,
  data: CreateDnsRecordRequest
): Promise<DnsRecord> {
  const response = await cfFetch<DnsRecord>(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.result
}

export async function updateDnsRecord(
  zoneId: string,
  recordId: string,
  data: CreateDnsRecordRequest
): Promise<DnsRecord> {
  const response = await cfFetch<DnsRecord>(
    `/zones/${zoneId}/dns_records/${recordId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  )
  return response.result
}

export async function deleteDnsRecord(
  zoneId: string,
  recordId: string
): Promise<void> {
  await cfFetch<{ id: string }>(`/zones/${zoneId}/dns_records/${recordId}`, {
    method: "DELETE",
  })
}

export async function exportDnsRecords(zoneId: string): Promise<string> {
  const token = getToken()
  const res = await fetch(
    `${CF_API_BASE}/zones/${zoneId}/dns_records/export`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  if (!res.ok) {
    throw new Error(`导出失败: ${res.status}`)
  }
  return res.text()
}

export async function importDnsRecords(
  zoneId: string,
  file: string
): Promise<{ recs_added: number; total_records_parsed: number }> {
  const token = getToken()
  const formData = new FormData()
  formData.append(
    "file",
    new Blob([file], { type: "text/plain" }),
    "dns_records.txt"
  )

  const res = await fetch(
    `${CF_API_BASE}/zones/${zoneId}/dns_records/import`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  )

  if (!res.ok) {
    const body = await res.text()
    let parsed: { errors?: Array<{ message: string }> } | null = null
    try {
      parsed = JSON.parse(body)
    } catch {}
    throw new Error(parsed?.errors?.[0]?.message || `导入失败: ${res.status}`)
  }

  const json = await res.json()
  return json.result
}

import type {
  CloudflareApiResponse,
  Zone,
  DnsRecord,
  CreateDnsRecordRequest,
  DnsRecordFilters,
} from "./dns-types"

const CF_API_BASE = "https://api.cloudflare.com/client/v4"

async function cfFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<CloudflareApiResponse<T>> {
  const res = await fetch(`${CF_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    const body = await res.text()
    let parsed: { errors?: Array<{ message: string }> } | null = null
    try { parsed = JSON.parse(body) } catch {}
    throw new Error(parsed?.errors?.[0]?.message || `Cloudflare API 错误: ${res.status}`)
  }

  const json = await res.json() as CloudflareApiResponse<T>
  if (!json.success) {
    throw new Error(json.errors?.[0]?.message || "Cloudflare API 返回失败")
  }
  return json
}

export async function listZones(token: string): Promise<Zone[]> {
  const response = await cfFetch<Zone[]>("/zones?per_page=1000&status=active", token)
  return response.result
}

export async function listDnsRecords(
  zoneId: string,
  token: string,
  filters?: DnsRecordFilters
): Promise<{ records: DnsRecord[]; total: number; totalPages?: number }> {
  const params = new URLSearchParams()
  params.set("per_page", String(filters?.per_page || 100))
  params.set("page", String(filters?.page || 1))
  if (filters?.type) params.set("type", filters.type)
  if (filters?.name) params.set("name", filters.name)
  if (filters?.content) params.set("content", filters.content)
  if (filters?.order) params.set("order", filters.order)
  if (filters?.direction) params.set("direction", filters.direction)

  const response = await cfFetch<DnsRecord[]>(
    `/zones/${zoneId}/dns_records?${params.toString()}`,
    token
  )
  return {
    records: response.result,
    total: response.result_info?.total_count || response.result.length,
    totalPages: response.result_info?.total_pages,
  }
}

export async function createDnsRecord(
  zoneId: string,
  token: string,
  data: CreateDnsRecordRequest
): Promise<DnsRecord> {
  const response = await cfFetch<DnsRecord>(`/zones/${zoneId}/dns_records`, token, {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.result
}

export async function updateDnsRecord(
  zoneId: string,
  recordId: string,
  token: string,
  data: CreateDnsRecordRequest
): Promise<DnsRecord> {
  const response = await cfFetch<DnsRecord>(
    `/zones/${zoneId}/dns_records/${recordId}`,
    token,
    { method: "PUT", body: JSON.stringify(data) }
  )
  return response.result
}

export async function deleteDnsRecord(
  zoneId: string,
  recordId: string,
  token: string
): Promise<void> {
  await cfFetch<{ id: string }>(`/zones/${zoneId}/dns_records/${recordId}`, token, {
    method: "DELETE",
  })
}

export async function exportDnsRecords(zoneId: string, token: string): Promise<string> {
  const res = await fetch(`${CF_API_BASE}/zones/${zoneId}/dns_records/export`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`导出失败: ${res.status}`)
  return res.text()
}

export async function importDnsRecords(
  zoneId: string,
  file: string,
  token: string
): Promise<{ recs_added: number; total_records_parsed: number }> {
  const formData = new FormData()
  formData.append("file", new Blob([file], { type: "text/plain" }), "dns_records.txt")

  const res = await fetch(`${CF_API_BASE}/zones/${zoneId}/dns_records/import`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text()
    let parsed: { errors?: Array<{ message: string }> } | null = null
    try { parsed = JSON.parse(body) } catch {}
    throw new Error(parsed?.errors?.[0]?.message || `导入失败: ${res.status}`)
  }

  const json = await res.json()
  return json.result
}

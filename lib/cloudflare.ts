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

export async function getZone(zoneId: string, token: string): Promise<Zone | null> {
  try {
    const response = await cfFetch<Zone>(`/zones/${zoneId}`, token)
    return response.result
  } catch {
    return null
  }
}

export async function listZones(token: string): Promise<Zone[]> {
  const response = await cfFetch<Zone[]>("/zones?per_page=1000&status=active", token)
  return response.result
}

export async function getCfAccountId(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${CF_API_BASE}/zones?per_page=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const json = await res.json()
    return (json.result?.[0] as { account?: { id: string } })?.account?.id ?? null
  } catch {
    return null
  }
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

// ── Zone Settings ─────────────────────────────────────────────────────────────

export interface ZoneSetting {
  id: string
  editable?: boolean
  modified_on?: string
  value: unknown
  [key: string]: unknown
}

export async function listZoneSettings(zoneId: string, token: string): Promise<ZoneSetting[]> {
  const response = await cfFetch<ZoneSetting[]>(`/zones/${zoneId}/settings`, token)
  return response.result
}

export async function updateZoneSetting(
  zoneId: string,
  settingId: string,
  value: unknown,
  token: string
): Promise<ZoneSetting> {
  const response = await cfFetch<ZoneSetting>(`/zones/${zoneId}/settings/${settingId}`, token, {
    method: "PATCH",
    body: JSON.stringify({ value }),
  })
  return response.result
}

// ── Cache ─────────────────────────────────────────────────────────────────────

export async function purgeCacheAll(zoneId: string, token: string): Promise<{ id: string }> {
  const response = await cfFetch<{ id: string }>(`/zones/${zoneId}/purge_cache`, token, {
    method: "POST",
    body: JSON.stringify({ purge_everything: true }),
  })
  return response.result
}

export async function purgeCacheByUrls(
  zoneId: string,
  urls: string[],
  token: string
): Promise<{ id: string }> {
  const response = await cfFetch<{ id: string }>(`/zones/${zoneId}/purge_cache`, token, {
    method: "POST",
    body: JSON.stringify({ files: urls }),
  })
  return response.result
}

// ── Email Routing ─────────────────────────────────────────────────────────────

export interface EmailRoutingRule {
  id: string
  name?: string
  enabled?: boolean
  priority?: number
  actions?: unknown[]
  matchers?: unknown[]
  [key: string]: unknown
}

export async function listEmailRoutingRules(
  zoneId: string,
  token: string
): Promise<EmailRoutingRule[]> {
  const response = await cfFetch<EmailRoutingRule[]>(`/zones/${zoneId}/email/routing/rules`, token)
  return response.result
}

export async function createEmailRoutingRule(
  zoneId: string,
  data: Omit<EmailRoutingRule, "id">,
  token: string
): Promise<EmailRoutingRule> {
  const response = await cfFetch<EmailRoutingRule>(`/zones/${zoneId}/email/routing/rules`, token, {
    method: "POST",
    body: JSON.stringify(data),
  })
  return response.result
}

export async function updateEmailRoutingRule(
  zoneId: string,
  ruleId: string,
  data: Partial<Omit<EmailRoutingRule, "id">>,
  token: string
): Promise<EmailRoutingRule> {
  const response = await cfFetch<EmailRoutingRule>(
    `/zones/${zoneId}/email/routing/rules/${ruleId}`,
    token,
    { method: "PUT", body: JSON.stringify(data) }
  )
  return response.result
}

export async function deleteEmailRoutingRule(
  zoneId: string,
  ruleId: string,
  token: string
): Promise<void> {
  await cfFetch<{ id: string }>(`/zones/${zoneId}/email/routing/rules/${ruleId}`, token, {
    method: "DELETE",
  })
}

// ── Firewall ──────────────────────────────────────────────────────────────────

export interface FirewallRule {
  id: string
  mode: string
  configuration: { target: string; value: string }
  notes?: string
  [key: string]: unknown
}

export async function listFirewallRules(zoneId: string, token: string): Promise<FirewallRule[]> {
  const response = await cfFetch<FirewallRule[]>(
    `/zones/${zoneId}/firewall/access_rules/rules`,
    token
  )
  return response.result
}

export async function createFirewallRule(
  zoneId: string,
  data: { mode: string; configuration: { target: string; value: string }; notes?: string },
  token: string
): Promise<FirewallRule> {
  const response = await cfFetch<FirewallRule>(
    `/zones/${zoneId}/firewall/access_rules/rules`,
    token,
    { method: "POST", body: JSON.stringify(data) }
  )
  return response.result
}

export async function deleteFirewallRule(
  zoneId: string,
  ruleId: string,
  token: string
): Promise<void> {
  await cfFetch<{ id: string }>(
    `/zones/${zoneId}/firewall/access_rules/rules/${ruleId}`,
    token,
    { method: "DELETE" }
  )
}

// ── Workers Routes ────────────────────────────────────────────────────────────

export interface WorkerRoute {
  id: string
  pattern: string
  script?: string
  [key: string]: unknown
}

export async function listWorkersRoutes(zoneId: string, token: string): Promise<WorkerRoute[]> {
  const response = await cfFetch<WorkerRoute[]>(`/zones/${zoneId}/workers/routes`, token)
  return response.result
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface ZoneAnalytics {
  totals?: Record<string, unknown>
  timeseries?: Array<Record<string, unknown>>
  [key: string]: unknown
}

export async function getZoneAnalytics(
  zoneId: string,
  token: string,
  since?: string,
  until?: string
): Promise<ZoneAnalytics> {
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 3600 * 1000)
  const untilDate = until ? new Date(until) : new Date()
  const diffHours = (untilDate.getTime() - sinceDate.getTime()) / (1000 * 3600)
  const useDaily = diffHours > 48

  const query = useDaily
    ? `query($zoneTag:String!,$since:Date!,$until:Date!){viewer{zones(filter:{zoneTag:$zoneTag}){httpRequests1dGroups(limit:366,filter:{date_geq:$since,date_leq:$until}){dimensions{date}sum{requests bytes threats cachedRequests cachedBytes pageViews}uniq{uniques}}}}}`
    : `query($zoneTag:String!,$since:Time!,$until:Time!){viewer{zones(filter:{zoneTag:$zoneTag}){httpRequests1hGroups(limit:1000,filter:{datetime_geq:$since,datetime_leq:$until}){dimensions{datetime}sum{requests bytes threats cachedRequests cachedBytes pageViews}uniq{uniques}}}}}`

  const variables = useDaily
    ? { zoneTag: zoneId, since: sinceDate.toISOString().split("T")[0], until: untilDate.toISOString().split("T")[0] }
    : { zoneTag: zoneId, since: sinceDate.toISOString(), until: untilDate.toISOString() }

  const res = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`GraphQL API 错误: ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GraphQL 查询失败")

  const zoneData = json.data?.viewer?.zones?.[0]
  const groups: Array<{
    dimensions: { datetime?: string; date?: string }
    sum: { requests: number; bytes: number; threats: number; cachedRequests: number; cachedBytes: number; pageViews: number }
    uniq: { uniques: number }
  }> = useDaily
    ? (zoneData?.httpRequests1dGroups ?? [])
    : (zoneData?.httpRequests1hGroups ?? [])

  let totalRequests = 0, totalBytes = 0, totalThreats = 0, totalPageViews = 0, totalUniques = 0
  const timeseries = groups.map((g) => {
    totalRequests += g.sum.requests
    totalBytes += g.sum.bytes
    totalThreats += g.sum.threats
    totalPageViews += g.sum.pageViews
    totalUniques += g.uniq.uniques
    return { since: g.dimensions?.datetime ?? g.dimensions?.date ?? "", requests: { all: g.sum.requests } }
  })

  return {
    totals: {
      requests: { all: totalRequests },
      bandwidth: { all: totalBytes },
      threats: { all: totalThreats },
      pageviews: { all: totalPageViews },
      uniques: { all: totalUniques },
    },
    timeseries,
  }
}

// ── Bulk Redirects ────────────────────────────────────────────────────────────

export async function listBulkRedirectLists(
  accountId: string,
  token: string
): Promise<Array<Record<string, unknown>>> {
  const response = await cfFetch<Array<Record<string, unknown>>>(
    `/accounts/${accountId}/rules/lists?kind=redirect`,
    token
  )
  return response.result
}

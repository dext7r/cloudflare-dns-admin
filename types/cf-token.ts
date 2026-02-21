export type PermStatus = "ok" | "missing" | "error" | "unverified"

export interface Permission {
  key: string
  label: string
  status: PermStatus
  cfPermission?: string  // Cloudflare 权限名，缺失时展示给用户
  note?: string
}

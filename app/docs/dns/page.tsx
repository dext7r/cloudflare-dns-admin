import Link from "next/link"

const recordTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA", "LOC", "NAPTR", "SMIMEA", "SSHFP", "TLSA", "URI"]

const features = [
  { title: "Cloudflare 代理（橙云）", desc: "代理开关仅对 A / AAAA / CNAME 生效，其余类型不支持橙云代理。" },
  { title: "TTL", desc: "设为 Auto 时由 Cloudflare 自动管理缓存时长，适合大多数常规场景。" },
  { title: "BIND 导入导出", desc: "提供标准 BIND 格式导入与导出，可用于跨系统迁移或离线备份。" },
  { title: "批量删除", desc: "支持多选记录后一次性删除，适合清理历史记录或回滚批量错误配置。" },
  { title: "服务端分页", desc: "列表采用服务端分页，支持每页 5 / 10 / 20 / 50 / 100 / 500 / 1000 条。" },
  { title: "搜索与类型筛选", desc: "支持按关键字搜索并结合记录类型过滤，快速定位目标记录。" },
]

export default function DnsPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">DNS 管理</h1>
        <p className="text-muted-foreground mt-1 text-sm">记录类型、批量操作与功能说明</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">
          支持的记录类型（{recordTypes.length} 种）
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {recordTypes.map((t) => (
            <span
              key={t}
              className="rounded border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-mono text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {features.map((f) => (
        <section key={f.title}>
          <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">{f.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
        </section>
      ))}

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">受保护域名</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          当域名被配置到{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">PROTECTED_ZONES</code>{" "}
          后，其下 DNS 记录无法被修改（新增、编辑、删除均受限）。详见{" "}
          <Link href="/docs/protected-zones" className="underline underline-offset-4">
            受保护域名文档
          </Link>
          。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          如需了解角色对 DNS 操作的影响，请阅读{" "}
          <Link href="/docs/users" className="underline underline-offset-4">
            用户与权限
          </Link>
          。
        </p>
      </section>
    </article>
  )
}

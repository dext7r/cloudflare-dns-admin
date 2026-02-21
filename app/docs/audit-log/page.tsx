export default function AuditLogDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">审计日志</h1>
        <p className="text-muted-foreground mt-1 text-sm">追踪所有 DNS 操作记录，满足合规与审计需求</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          审计日志页面展示系统内所有 DNS 操作记录，包含操作人、操作类型、目标域名与记录详情。支持按用户邮箱与操作类型筛选，并提供分页浏览。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">记录的操作类型</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-green-500">dns.create</strong> — 创建 DNS 记录</p>
          <p>• <strong className="text-blue-500">dns.update</strong> — 编辑 DNS 记录</p>
          <p>• <strong className="text-red-500">dns.delete</strong> — 删除单条 DNS 记录</p>
          <p>• <strong className="text-red-500">dns.batch_delete</strong> — 批量删除 DNS 记录</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">详情字段</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          点击「详情」按钮可查看操作前后的完整 JSON 数据（before / after），便于追溯变更内容与回滚参考。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">数据存储</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          审计日志存储于本地 PostgreSQL 数据库（表名 <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">dns_audit_logs</code>），不依赖 Cloudflare 存储，不受 CF 套餐限制。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          审计日志仅 ADMIN 可查看（<code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">/admin/audit-log</code>）。
        </p>
      </section>
    </article>
  )
}

import Link from "next/link"

const protectionScope = [
  "UI 层：隐藏添加记录、导入按钮；禁用编辑和删除操作入口",
  "API 层：POST（创建）、PUT（更新）、DELETE 接口均返回 403",
  "代理开关：禁止切换 Cloudflare 代理状态",
]

export default function ProtectedZonesPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">受保护域名</h1>
        <p className="text-muted-foreground mt-1 text-sm">防止关键域名的 DNS 记录被误删或误改</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          通过{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">PROTECTED_ZONES</code>{" "}
          指定的域名将被全面保护，该域名下的 DNS 记录禁止新增、编辑和删除操作，适合保护业务核心域名。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">配置方式</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          在{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>{" "}
          中配置，多个域名以逗号分隔：
        </p>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`PROTECTED_ZONES="example.com,critical.example.org"`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">保护范围</h2>
        <div className="space-y-1.5">
          {protectionScope.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">受保护超管</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">PROTECTED_ADMIN_EMAIL</code>{" "}
          与受保护域名相互独立：前者锁定指定账号的密码、角色修改和删除；后者锁定指定域名的所有 DNS 写入操作。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          查看{" "}
          <Link href="/docs/configuration" className="underline underline-offset-4">
            环境配置
          </Link>{" "}
          了解所有环境变量的完整说明。
        </p>
      </section>
    </article>
  )
}

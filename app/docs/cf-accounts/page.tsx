import Link from "next/link"

export default function CfAccountsPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Cloudflare 账号</h1>
        <p className="text-muted-foreground mt-1 text-sm">Token 管理、权限要求与用户绑定关系</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">CF 账号的作用</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          系统中的 CF 账号用于存储 Cloudflare API Token，应用通过该 Token 拉取 Zone 列表并执行 DNS
          操作。一个系统账号可绑定多个 CF 账号，实现多租户隔离。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">Token 加密存储</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          API Token 在数据库中采用 AES-256-GCM 加密后落盘，降低敏感凭据泄露风险。Token
          明文仅在运行时于服务端内存中短暂存在。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">最小权限要求</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Token 至少需要以下两项权限：
        </p>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`Zone > DNS > Edit
Zone > Zone > Read`}</code>
        </pre>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          可在{" "}
          <Link
            href="https://dash.cloudflare.com/profile/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            dash.cloudflare.com/profile/api-tokens
          </Link>{" "}
          创建并配置权限。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">多账号绑定策略</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">ADMIN</code>{" "}
          可查看并使用全部 CF 账号；
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono mx-1">VIEWER</code>
          仅可查看与自己绑定的账号，保证访问隔离。绑定关系在用户管理页进行配置。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">管理入口</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cloudflare 账号维护入口为{" "}
          <Link href="/admin/cf-accounts" className="underline underline-offset-4">
            /admin/cf-accounts
          </Link>
          （需 ADMIN 权限），可进行新增、编辑与删除。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          账号配置完成后，可继续查看{" "}
          <Link href="/docs/dns" className="underline underline-offset-4">
            DNS 管理
          </Link>{" "}
          了解记录操作能力。
        </p>
      </section>
    </article>
  )
}

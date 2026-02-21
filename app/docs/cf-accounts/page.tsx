import Link from "next/link"

const requiredPermissions = [
  {
    cf: "Zone → 区域 → 读取",
    feature: "Zone 列表",
    desc: "拉取账号下所有 Zone，是所有功能的前置条件",
  },
  {
    cf: "Zone → DNS → 编辑",
    feature: "DNS 管理",
    desc: "读取、创建、更新、删除 DNS 记录",
  },
]

const optionalPermissions = [
  {
    cf: "Zone → 区域设置 → 编辑",
    feature: "Zone 设置",
    page: "/zone-settings",
    desc: "读取并切换 SSL、HSTS、最小化、Brotli 等 Zone 级配置",
  },
  {
    cf: "Zone → 缓存规则 → 清除",
    feature: "缓存管理",
    page: "/cache",
    desc: "清除全站或指定 URL 缓存（写操作，无法自动探测，需手动确认已添加）",
  },
  {
    cf: "Zone → 电子邮件路由 → 编辑",
    feature: "邮件路由",
    page: "/email-routing",
    desc: "查看 Email Routing 规则及目标地址列表",
  },
  {
    cf: "Zone → 防火墙服务 → 编辑",
    feature: "IP 防火墙",
    page: "/firewall",
    desc: "查看 IP 访问规则（允许 / 阻止 / 挑战）",
  },
  {
    cf: "Zone → Workers 路由 → 读取",
    feature: "Workers 路由",
    page: "/workers-routes",
    desc: "查看绑定在该 Zone 的 Workers 路由规则",
  },
  {
    cf: "Zone → 分析 → 读取",
    feature: "流量分析",
    page: "/analytics",
    desc: "读取请求量、带宽、威胁数、独立访客等统计数据",
  },
  {
    cf: "账号 → Lists → 读取",
    feature: "批量重定向",
    page: "/redirects",
    desc: "读取账号级 Bulk Redirect 列表（非 Zone 级，需账号权限）",
  },
]

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
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限要求</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          在{" "}
          <Link
            href="https://dash.cloudflare.com/profile/api-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Cloudflare Dashboard → API Tokens
          </Link>{" "}
          创建自定义 Token 时，按下表配置权限。必需权限缺失将导致核心功能不可用；可选权限缺失仅影响对应页面。
        </p>

        <h3 className="text-sm font-semibold mb-2">必需权限</h3>
        <div className="rounded-lg border border-border/50 overflow-hidden text-sm mb-5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Cloudflare 权限</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">功能</th>
                <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-muted-foreground">说明</th>
              </tr>
            </thead>
            <tbody>
              {requiredPermissions.map((p, i) => (
                <tr key={p.cf} className={i % 2 !== 0 ? "bg-muted/10" : ""}>
                  <td className="px-3 py-2 font-mono text-xs">{p.cf}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{p.feature}</td>
                  <td className="hidden sm:table-cell px-3 py-2 text-muted-foreground/70">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold mb-2">可选权限（按需添加）</h3>
        <div className="rounded-lg border border-border/50 overflow-hidden text-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Cloudflare 权限</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">功能页面</th>
                <th className="hidden sm:table-cell px-3 py-2 text-left text-xs font-medium text-muted-foreground">说明</th>
              </tr>
            </thead>
            <tbody>
              {optionalPermissions.map((p, i) => (
                <tr key={p.cf} className={i % 2 !== 0 ? "bg-muted/10" : ""}>
                  <td className="px-3 py-2 font-mono text-xs">{p.cf}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Link href={p.page} className="underline underline-offset-4 text-foreground/80 text-sm">
                      {p.feature}
                    </Link>
                  </td>
                  <td className="hidden sm:table-cell px-3 py-2 text-muted-foreground/70">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-3">
          缓存清除为写操作，系统无法通过安全探测确认该权限是否存在，需在创建 Token 时手动确认已勾选。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限检测</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          在{" "}
          <Link href="/admin/cf-accounts" className="underline underline-offset-4">
            CF 账号管理
          </Link>{" "}
          页面点击「验证」，系统并行探测上述 8 项可自动验证的权限，以弹窗展示每项检测结果。缺失的权限会在 Toast
          中列出对应的 Cloudflare 权限名称，便于快速定位并补充。
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

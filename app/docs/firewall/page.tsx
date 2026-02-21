export default function FirewallDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">IP 防火墙</h1>
        <p className="text-muted-foreground mt-1 text-sm">管理 Cloudflare IP 访问规则，封锁或放行特定 IP</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          IP 防火墙页面调用 Cloudflare Firewall Access Rules API，展示当前 Zone
          的 IP 规则列表，支持新增（ADMIN）与删除（ADMIN）操作。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">规则模式</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-red-500">block</strong> — 封锁指定 IP 的所有请求</p>
          <p>• <strong className="text-green-500">whitelist</strong> — 放行指定 IP，跳过其他安全检查</p>
          <p>• <strong className="text-yellow-500">challenge</strong> — 对指定 IP 发起 CAPTCHA 挑战</p>
          <p>• <strong className="text-yellow-400">js_challenge</strong> — 发起 JavaScript 挑战（较轻量）</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">目标类型</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-foreground">ip</strong> — 单个 IPv4/IPv6 地址</p>
          <p>• <strong className="text-foreground">ip_range</strong> — CIDR 格式的 IP 段（如 192.168.0.0/24）</p>
          <p>• <strong className="text-foreground">asn</strong> — 自治系统编号（如 AS13335）</p>
          <p>• <strong className="text-foreground">country</strong> — 两字母国家代码（如 CN、US）</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          查看规则：所有已登录用户。新增、删除规则：仅 ADMIN。
        </p>
      </section>
    </article>
  )
}

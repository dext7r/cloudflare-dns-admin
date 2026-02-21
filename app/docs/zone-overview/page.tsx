import Link from "next/link"

const settingItems = [
  { key: "always_use_https", label: "Always Use HTTPS", desc: "强制将所有 HTTP 请求重定向到 HTTPS，提升安全性" },
  { key: "brotli", label: "Brotli 压缩", desc: "启用 Brotli 压缩算法，比 gzip 更高效，减小传输体积" },
  { key: "development_mode", label: "开发模式", desc: "临时绕过 Cloudflare 缓存，便于调试，3 小时后自动关闭" },
  { key: "ssl", label: "SSL 模式", desc: "控制 Cloudflare 与源服务器之间的 TLS 连接方式（Off / Flexible / Full / Strict）" },
  { key: "security_level", label: "安全级别", desc: "控制对访客的挑战严格程度（essentially_off / low / medium / high / under_attack）" },
  { key: "min_tls_version", label: "最低 TLS 版本", desc: "拒绝低于指定版本的 TLS 握手（TLS 1.0 / 1.1 / 1.2 / 1.3）" },
]

export default function ZoneOverviewDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Zone 概览</h1>
        <p className="text-muted-foreground mt-1 text-sm">快速查看并切换当前 Zone 的关键安全与性能设置</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Zone 概览页面以卡片形式展示当前所选 Zone 的 6 项关键设置，支持 ADMIN 通过 Switch / Badge
          直接切换开关类与枚举类配置，无需进入 Cloudflare Dashboard 即可完成常规操作。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">展示的设置项</h2>
        <div className="space-y-3">
          {settingItems.map((item) => (
            <div key={item.key} className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              <code className="text-[10px] text-muted-foreground/60 font-mono mt-1 block">{item.key}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          所有用户均可查看设置项；开关与下拉选择器仅 ADMIN 可操作，VIEWER 将看到禁用状态的控件。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          若需更精细的 Zone 配置，请查阅{" "}
          <Link href="/docs/zone-settings" className="underline underline-offset-4">Zone 设置</Link>{" "}
          与{" "}
          <Link href="/docs/cache" className="underline underline-offset-4">缓存管理</Link>。
        </p>
      </section>
    </article>
  )
}

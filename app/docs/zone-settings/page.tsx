import Link from "next/link"

export default function ZoneSettingsDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Zone 设置</h1>
        <p className="text-muted-foreground mt-1 text-sm">精细化管理 Zone 级别的安全与性能开关</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Zone 设置页面以表格形式展示当前 Zone 的全部可配置项，并提供内联编辑能力：开关类设置使用
          Switch，枚举类设置使用 Select 下拉，每项修改即时生效并同步至 Cloudflare。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">常用配置项</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-foreground">always_use_https</strong> — 强制 HTTPS 重定向</p>
          <p>• <strong className="text-foreground">brotli</strong> — Brotli 压缩</p>
          <p>• <strong className="text-foreground">development_mode</strong> — 开发模式（绕过缓存）</p>
          <p>• <strong className="text-foreground">http3</strong> — HTTP/3 (QUIC) 支持</p>
          <p>• <strong className="text-foreground">websockets</strong> — WebSocket 代理</p>
          <p>• <strong className="text-foreground">ssl</strong> — SSL 模式（Off / Flexible / Full / Full Strict）</p>
          <p>• <strong className="text-foreground">security_level</strong> — 安全挑战级别</p>
          <p>• <strong className="text-foreground">min_tls_version</strong> — 最低 TLS 版本</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          所有用户可查看设置值；仅 ADMIN 可进行修改操作。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          快速预览关键配置可使用{" "}
          <Link href="/docs/zone-overview" className="underline underline-offset-4">Zone 概览</Link>；
          缓存相关操作请查看{" "}
          <Link href="/docs/cache" className="underline underline-offset-4">缓存管理</Link>。
        </p>
      </section>
    </article>
  )
}

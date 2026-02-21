import Link from "next/link"

const metrics = [
  { label: "请求总量", desc: "所有 HTTP/HTTPS 请求数，包含缓存命中与回源" },
  { label: "流量（带宽）", desc: "传输字节数，按 GB / MB / KB 自动换算" },
  { label: "缓存命中率", desc: "Cloudflare 边缘节点直接响应的请求占比" },
  { label: "威胁数", desc: "被 Cloudflare 拦截的恶意请求数量" },
  { label: "页面浏览量", desc: "HTML 页面请求数（非 API / 静态资源）" },
]

export default function AnalyticsDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">流量分析</h1>
        <p className="text-muted-foreground mt-1 text-sm">查看域名的请求量、带宽与缓存命中率</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          流量分析页面调用 Cloudflare Analytics API，展示所选 Zone 在过去 1 小时、24 小时或 7
          天内的流量摘要与时序图表。数据来源为 Cloudflare 边缘网络，近实时更新。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">指标说明</h2>
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-start gap-3 text-sm">
              <span className="font-medium shrink-0 w-28">{m.label}</span>
              <span className="text-muted-foreground leading-relaxed">{m.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">套餐限制</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cloudflare Free 套餐不支持 Analytics API，页面将显示相应提示。若需此功能，请升级至 Pro
          或更高套餐。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          分析数据为只读，所有已登录用户均可查看。
        </p>
      </section>
    </article>
  )
}

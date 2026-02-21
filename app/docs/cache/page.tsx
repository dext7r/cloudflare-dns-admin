export default function CacheDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">缓存管理</h1>
        <p className="text-muted-foreground mt-1 text-sm">一键清除全站或指定 URL 的 Cloudflare 缓存</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">清除全站缓存</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          清除该 Zone 下所有 Cloudflare 边缘节点的缓存内容，所有请求将回源一次重新建立缓存。操作前需确认弹窗，防止误触。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">按 URL 清除</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          仅清除指定 URL 的缓存，不影响其他内容。在文本框中每行输入一个完整 URL，支持批量输入，例如：
        </p>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`https://example.com/
https://example.com/static/main.js
https://example.com/api/v1/data`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          缓存清除为写操作，仅 ADMIN 可执行。VIEWER 可查看页面但操作按钮处于禁用状态。
        </p>
      </section>
    </article>
  )
}

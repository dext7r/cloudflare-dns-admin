export default function WorkersRoutesDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Workers 路由</h1>
        <p className="text-muted-foreground mt-1 text-sm">查看绑定到当前 Zone 的 Cloudflare Workers 路由</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Workers 路由页面展示当前 Zone 下所有已配置的 Workers 路由规则，包含路由模式（Pattern）与绑定的
          Worker 脚本名称。路由 ID 可复制以供其他工具使用。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          当前版本为只读视图。Workers 路由的创建与删除请在 Cloudflare Dashboard 或使用 Wrangler CLI 完成。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">路由模式示例</h2>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`example.com/*
api.example.com/v2/*
example.com/static/*`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Workers 路由数据为只读，所有已登录用户均可查看。
        </p>
      </section>
    </article>
  )
}

export default function EmailRoutingDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">邮件路由</h1>
        <p className="text-muted-foreground mt-1 text-sm">管理 Cloudflare Email Routing 转发规则</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          邮件路由页面展示当前 Zone 下的所有 Cloudflare Email Routing 转发规则，支持新增（ADMIN）与删除（ADMIN）操作。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">创建规则</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          点击「添加规则」填写以下字段：
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-foreground">规则名称</strong> — 便于识别的描述性名称</p>
          <p>• <strong className="text-foreground">匹配邮箱</strong> — 接收邮件的源地址（如 contact@example.com）</p>
          <p>• <strong className="text-foreground">转发至</strong> — 目标邮箱地址，需在 Cloudflare 后台提前验证</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">前置要求</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          需要在 Cloudflare 控制台为该域名启用 Email Routing，且目标邮箱地址已通过验证。API Token 需具备{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">Email Routing Rules</code> 读写权限。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          查看规则列表：所有已登录用户。添加、删除规则：仅 ADMIN。
        </p>
      </section>
    </article>
  )
}

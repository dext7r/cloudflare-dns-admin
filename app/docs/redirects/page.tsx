export default function RedirectsDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">批量重定向</h1>
        <p className="text-muted-foreground mt-1 text-sm">查看账号级别的 Cloudflare Bulk Redirect 列表</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          批量重定向页面展示所选 Cloudflare 账号下的全部 Bulk Redirect 列表（List）及其基本信息，包括列表名称、描述与规则数量。
          此功能为账号级（非 Zone 级），因此选择账号后直接展示，无需选择 Zone。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          当前版本为只读视图。Bulk Redirect 规则的详细配置请在 Cloudflare Dashboard 完成。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">前置要求</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          API Token 需具备{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">Account › Lists › Read</code>{" "}
          权限。若无此权限，页面将展示相应的错误提示。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          批量重定向列表为只读，所有已登录用户均可查看。
        </p>
      </section>
    </article>
  )
}

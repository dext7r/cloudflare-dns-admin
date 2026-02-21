export default function WebhooksDocPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Webhook</h1>
        <p className="text-muted-foreground mt-1 text-sm">将 DNS 变更事件实时推送至外部系统</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">功能说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Webhook 页面用于配置变更通知端点。每次 DNS 操作（创建、更新、删除）触发时，系统将向所有启用的
          Webhook 发送 HTTP POST 请求。
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          当前实现为配置管理界面，Webhook 触发逻辑需通过后续集成审计事件实现。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">配置字段</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong className="text-foreground">名称</strong> — 便于识别的描述性名称</p>
          <p>• <strong className="text-foreground">URL</strong> — 接收 POST 请求的端点地址（需 HTTPS）</p>
          <p>• <strong className="text-foreground">监听事件</strong> — 选择触发推送的事件类型</p>
          <p>• <strong className="text-foreground">Secret</strong> — 可选；用于 HMAC 签名验证，接收方可用于验证请求来源</p>
          <p>• <strong className="text-foreground">启用</strong> — 开关控制是否激活该 Webhook</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">支持的事件</h2>
        <div className="space-y-1 text-sm">
          <p><code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">dns.create</code></p>
          <p><code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">dns.update</code></p>
          <p><code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">dns.delete</code></p>
          <p><code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">dns.batch_delete</code></p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">权限说明</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Webhook 管理仅 ADMIN 可访问（<code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">/admin/webhooks</code>）。
        </p>
      </section>
    </article>
  )
}

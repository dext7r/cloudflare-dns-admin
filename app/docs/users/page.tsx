import Link from "next/link"

const adminAbilities = [
  "管理全部 DNS 记录（增删改查）",
  "管理用户：创建、分配角色、删除",
  "管理 Cloudflare 账号与 Token",
  "批量删除 DNS 记录、BIND 导入导出",
]

const viewerAbilities = [
  "查看已绑定 CF 账号下的 Zone 与 DNS 记录",
  "搜索、筛选、分页浏览 DNS 列表",
  "复制记录内容",
]

export default function UsersPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">用户与权限</h1>
        <p className="text-muted-foreground mt-1 text-sm">角色能力、账号维护与安全限制</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">角色类型</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          系统提供两种角色：
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono mx-1">ADMIN</code>
          与
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono mx-1">VIEWER</code>，
          分别对应完整管理权限与只读权限。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">ADMIN 权限</h2>
        <div className="space-y-1.5">
          {adminAbilities.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">VIEWER 权限</h2>
        <div className="space-y-1.5">
          {viewerAbilities.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          VIEWER 无法访问{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">/admin/*</code>{" "}
          路由，所有写操作 API 均返回 403。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">用户管理入口</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          用户创建与角色分配在{" "}
          <Link href="/admin/users" className="underline underline-offset-4">
            /admin/users
          </Link>{" "}
          完成（需 ADMIN 权限）。每个用户均可通过侧边栏的「修改密码」弹窗更新个人密码。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">受保护超级管理员</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          配置{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">PROTECTED_ADMIN_EMAIL</code>{" "}
          后，该账号的密码、角色修改与删除操作将被禁止，作为系统兜底超管保护机制。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">相关文档</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          若需了解账号与 Token 关系，请继续阅读{" "}
          <Link href="/docs/cf-accounts" className="underline underline-offset-4">
            Cloudflare 账号
          </Link>
          。
        </p>
      </section>
    </article>
  )
}

import Link from "next/link"

const vars = [
  {
    name: "DATABASE_URL",
    desc: "PostgreSQL 连接字符串，应用通过该连接访问业务数据与认证数据。",
    example: `DATABASE_URL="postgresql://user:pass@localhost:5432/dns_admin"`,
  },
  {
    name: "AUTH_SECRET",
    desc: "NextAuth JWT 的签名密钥，建议使用 openssl rand -base64 32 生成高强度随机值。",
    example: `AUTH_SECRET="<openssl rand -base64 32>"`,
  },
  {
    name: "AUTH_URL",
    desc: "应用的公网访问地址。反向代理或 Docker 部署时必填，NextAuth.js 使用该值构建重定向 URL；缺失时会使用容器内部地址（如 http://0.0.0.0:3000）导致退出登录等跳转异常。本地开发可省略。",
    example: `AUTH_URL="https://cloudflare-dns.us.ci"`,
  },
  {
    name: "SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD",
    desc: "仅用于 prisma db seed，创建首个管理员账号。生产环境首次登录后请立即修改密码。",
    example: `SEED_ADMIN_EMAIL="admin@example.com"\nSEED_ADMIN_PASSWORD="changeme123"`,
  },
  {
    name: "PROTECTED_ZONES",
    desc: "逗号分隔的域名列表，命中的域名下所有 DNS 增删改操作将被拒绝，适合保护核心业务域名。",
    example: `PROTECTED_ZONES="example.com,critical.example.org"`,
  },
  {
    name: "PROTECTED_ADMIN_EMAIL",
    desc: "指定的账号将被锁定，禁止修改密码、修改角色与删除，作为系统兜底超管保护机制。",
    example: `PROTECTED_ADMIN_EMAIL="admin@example.com"`,
  },
  {
    name: "DEMO_MODE",
    desc: "设为 true 时，登录页自动填充 seed 管理员凭据，便于演示与测试；生产环境应保持 false。",
    example: `DEMO_MODE="false"`,
  },
]

export default function ConfigurationPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">环境配置</h1>
        <p className="text-muted-foreground mt-1 text-sm">所有环境变量的用途与配置示例</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">配置文件</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          在项目根目录创建{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>，
          参考{" "}
          <code className="bg-muted/60 px-1.5 py-0.5 rounded text-xs font-mono">.env.example</code>{" "}
          填入各项配置。
        </p>
      </section>

      {vars.map((v) => (
        <section key={v.name}>
          <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">{v.name}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{v.desc}</p>
          <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
            <code>{v.example}</code>
          </pre>
        </section>
      ))}

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">下一步</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          完成环境变量配置后，可继续阅读{" "}
          <Link href="/docs/deployment" className="underline underline-offset-4">
            部署指南
          </Link>{" "}
          进行上线。
        </p>
      </section>
    </article>
  )
}

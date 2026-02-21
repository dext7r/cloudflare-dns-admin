import Link from "next/link"

const steps = [
  {
    title: "克隆并安装依赖",
    desc: "确保已安装 Node.js 18+、pnpm 和 PostgreSQL，然后克隆项目并安装依赖。",
    code: `git clone https://github.com/dext7r/cloudflare-dns-admin.git
cd cloudflare-dns-admin
pnpm install`,
  },
  {
    title: "配置环境变量",
    desc: "在项目根目录创建 .env.local，填入数据库连接和认证密钥。",
    code: `DATABASE_URL="postgresql://user:pass@localhost:5432/dns_admin"
AUTH_SECRET="<openssl rand -base64 32>"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="changeme123"`,
  },
  {
    title: "初始化数据库",
    desc: "执行数据库迁移并通过 seed 创建初始管理员账号。",
    code: `pnpm prisma migrate dev --name init
pnpm prisma db seed`,
  },
  {
    title: "启动开发服务器",
    desc: "启动后访问 http://localhost:3000，未登录时展示落地页。",
    code: `pnpm dev`,
  },
  {
    title: "添加 Cloudflare API Token",
    desc: "使用 seed 账号登录后，进入 /admin/cf-accounts 添加 Token。需要 Zone › DNS › Edit 和 Zone › Zone › Read 两项权限。",
    code: null,
  },
]

export default function GettingStartedPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">快速开始</h1>
        <p className="text-muted-foreground mt-1 text-sm">从安装到首次登录，完成本地开发环境搭建</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">前置要求</h2>
        <div className="flex flex-wrap gap-2">
          {["Node.js 18+", "pnpm", "PostgreSQL 14+"].map((req) => (
            <span
              key={req}
              className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
            >
              {req}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">安装步骤</h2>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {step.code && (
                  <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">下一步</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          开发环境就绪后，查看{" "}
          <Link href="/docs/configuration" className="underline underline-offset-4">
            环境配置
          </Link>{" "}
          了解所有可用配置项，或直接查阅{" "}
          <Link href="/docs/deployment" className="underline underline-offset-4">
            部署指南
          </Link>{" "}
          将应用上线。
        </p>
      </section>
    </article>
  )
}

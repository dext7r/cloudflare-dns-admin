import Link from "next/link"

export default function DeploymentPage() {
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">部署指南</h1>
        <p className="text-muted-foreground mt-1 text-sm">Zeabur、Docker、Vercel 三种部署方案</p>
      </header>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">Zeabur（推荐）</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Fork 仓库后在{" "}
          <Link href="https://zeabur.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            Zeabur
          </Link>{" "}
          创建项目，添加 PostgreSQL 服务，配置{" "}
          <Link href="/docs/configuration" className="underline underline-offset-4">
            环境变量
          </Link>{" "}
          后部署应用。Zeabur 支持自动构建，无需额外 CI 配置。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">Docker 部署</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          通过 docker-compose.yml 同时启动应用与 PostgreSQL，按实际环境替换镜像标签与密钥。
        </p>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`services:
  app:
    image: ghcr.io/dext7r/cloudflare-dns-admin:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/dns_admin"
      AUTH_SECRET: "replace-with-openssl-rand-base64-32"
      SEED_ADMIN_EMAIL: "admin@example.com"
      SEED_ADMIN_PASSWORD: "changeme123"
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: dns_admin
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">Vercel 部署</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vercel 可直接部署 Next.js，但必须使用外部 PostgreSQL（如{" "}
          <Link href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Neon</Link>
          、
          <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Supabase</Link>
          ），不支持本地容器数据库。
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold border-b border-border/40 pb-2 mb-4">部署后步骤</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          首次上线后需执行数据库迁移与 seed，若平台支持一次性命令，按顺序执行：
        </p>
        <pre className="bg-muted/60 rounded-lg px-4 py-3 text-sm font-mono border border-border/40 overflow-x-auto">
          <code>{`pnpm prisma migrate deploy
pnpm prisma db seed`}</code>
        </pre>
      </section>
    </article>
  )
}

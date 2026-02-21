# Cloudflare DNS Admin

基于 Next.js 构建的多用户 Cloudflare DNS 管理平台，支持多账号隔离、RBAC 权限控制和完整的 DNS 记录管理。

**演示地址**：[http://cloudflare-dns.us.ci/](http://cloudflare-dns.us.ci/)

## 功能

### DNS 管理

- 多 Zone（域名）可搜索下拉切换
- DNS 记录增删改查，支持 14 种记录类型（A / AAAA / CNAME / MX / TXT / NS / SRV / CAA / LOC / NAPTR / SMIMEA / SSHFP / TLSA / URI）
- 代理状态（橙色云朵）一键切换
- 批量删除、搜索 + 类型筛选
- BIND 格式导出 / 导入
- 服务端分页，支持自定义每页条数（5 / 10 / 20 / 50 / 100 / 500 / 1000）

### 多账号与权限

- 多 Cloudflare 账号（API Token）管理，Token AES-256-GCM 加密存储
- ADMIN / VIEWER 两级角色：VIEWER 只读，隐藏写操作入口
- 用户与 CF 账号多对多绑定，VIEWER 仅可访问已绑定账号
- 用户删除 / 账号删除时关联绑定自动级联清除

### 系统

- NextAuth.js v5 JWT 会话认证
- 亮色 / 暗色主题切换
- 修改密码

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

项目根目录创建 `.env.local`，参考 [`.env.example`](.env.example)：

```env
DATABASE_URL="postgresql://user:pass@host:5432/dns_admin"
AUTH_SECRET="<openssl rand -base64 32>"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="changeme"
```

### 3. 初始化数据库

```bash
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

### 4. 启动

```bash
pnpm dev
```

访问 `http://localhost:3000`，使用 seed 账号登录后，在 `/admin/cf-accounts` 添加 Cloudflare API Token。

Token 需要至少 **区域 → DNS → 编辑** 和 **区域 → 区域 → 读取** 权限，可[在此创建](https://dash.cloudflare.com/profile/api-tokens)。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 认证 | NextAuth.js v5 (Credentials + JWT) |
| 数据库 | PostgreSQL + Prisma 5 |
| UI | shadcn/ui + Tailwind CSS v4 |
| 状态/请求 | SWR |
| 表单验证 | react-hook-form + Zod |
| 包管理 | pnpm |

## License

[MIT](LICENSE) © 2026 [dext7r](https://github.com/dext7r)

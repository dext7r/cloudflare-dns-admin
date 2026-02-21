# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
pnpm dev                              # 启动开发服务器
pnpm build                            # 构建生产包
pnpm lint                             # ESLint 检查
pnpm prisma migrate dev --name <name> # 创建并应用迁移
pnpm prisma db seed                   # 创建初始 ADMIN 账号
pnpm prisma generate                  # 重新生成 Prisma Client
```

必要环境变量（`.env.local`）：

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="<openssl rand -base64 32>"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="changeme123"
```

## 架构概览

### 数据流

```
app/page.tsx (服务端, auth() 鉴权)
  ├─ 未登录 → <LandingPage />             ← 公开落地页，展示功能与项目链接
  └─ 已登录 → <AdminShell role user />    ← 侧边栏布局，含用户信息/主题/退出
               └─ <DnsManager role />     ← 唯一客户端状态中心，SWR 管理数据
                    ├─ <AccountSelector />  ← CF 账号选择（VIEWER 只见绑定账号）
                    ├─ <ZoneSelector />     ← 可搜索 combobox 切换 Zone
                    ├─ <DnsFilters />       ← 搜索 + 类型筛选
                    ├─ <DnsTable />         ← 纯展示 + 服务端分页 + 每页条数
                    ├─ <DnsRecordForm />    ← 创建/编辑（react-hook-form + zod）
                    ├─ <DnsBatchActions />  ← 批量删除（ADMIN only）
                    └─ <DnsImportDialog />  ← BIND 格式导入（ADMIN only）

app/admin/cf-accounts/page.tsx        ← CF 账号管理（ADMIN only）
app/admin/users/page.tsx              ← 用户管理（ADMIN only）
app/login/page.tsx                    ← 登录页（分栏布局，左侧品牌/右侧表单）
```

### API 路由

| 路由 | 方法 | 说明 | 权限 |
|------|------|------|------|
| `/api/cloudflare/zones` | GET | 获取 Zone 列表 | 已登录 |
| `/api/cloudflare/dns` | GET / POST | DNS 记录列表 / 创建 | GET:已登录, POST:ADMIN |
| `/api/cloudflare/dns/[id]` | PUT / DELETE | 更新 / 删除单条 | ADMIN |
| `/api/cloudflare/dns/batch` | POST | 批量删除 | ADMIN |
| `/api/cloudflare/dns/export` | GET | 导出 BIND | 已登录 |
| `/api/cloudflare/dns/import` | POST | 导入 BIND | ADMIN |
| `/api/admin/cf-accounts` | GET / POST | CF 账号管理 | ADMIN |
| `/api/admin/cf-accounts/[id]` | PATCH / DELETE | 编辑 / 删除 CF 账号 | ADMIN |
| `/api/admin/cf-accounts/[id]/test` | GET | 测试 Token 可用性 | 已登录 |
| `/api/admin/users` | GET / POST | 用户管理 | ADMIN |
| `/api/admin/users/[id]` | PATCH / DELETE | 更新角色 / 删除用户 | ADMIN |
| `/api/admin/users/[id]/cf-accounts` | PUT | 更新用户绑定账号 | ADMIN |
| `/api/profile/password` | PATCH | 修改密码 | 已登录 |
| `/api/auth/[...nextauth]` | * | NextAuth.js handlers | — |

路由保护通过 `app/page.tsx` 服务端 `auth()` 检查实现：未登录显示落地页，VIEWER 访问 `/admin/*` → 服务端 redirect 到 `/`。

### 关键文件

- **`lib/auth.ts`** — NextAuth.js 核心（handlers / auth / signIn / signOut）
- **`lib/auth-guard.ts`** — API 路由鉴权：`requireAuth(role?)`，返回 `{ error, session }`
- **`lib/cf-token.ts`** — AES-256-GCM 加密/解密 CF API Token（`encrypt` / `decrypt`）；`resolveToken(accountId?, session?)` 含 VIEWER 账号绑定校验
- **`lib/prisma.ts`** — PrismaClient 全局单例
- **`lib/cloudflare.ts`** — 服务端 Cloudflare API v4 封装；`getZone()` 用于受保护域名检查
- **`lib/dns-types.ts`** — 全部 TS 类型，14 种记录类型的 `data` 字段结构
- **`components/LandingPage.tsx`** — 公开落地页（无需登录），hero + 功能卡 + 技术栈 + CTA
- **`components/DnsManager.tsx`** — 客户端状态编排中心；受保护区域隐藏增删改入口
- **`components/DnsTable.tsx`** — `readonly` 控制 VIEWER 权限；`protectedZone` 控制受保护域名（隐藏 checkbox / 编辑 / 删除，禁用代理切换）
- **`components/DnsRecordForm.tsx`** — 根据记录类型动态渲染字段
- **`prisma/schema.prisma`** — User / CfAccount / UserCfAccount 模型
- **`types/next-auth.d.ts`** — 扩展 Session / JWT 类型加入 `role`

### 数据库模型

```
User ──┐
       ├─< UserCfAccount >─── CfAccount
       │   (cascade delete)
```

- `User`：email / passwordHash / role(ADMIN|VIEWER)
- `CfAccount`：name / encryptedToken / lastTestAt / lastTestStatus
- `UserCfAccount`：userId + cfAccountId（联合主键，双向 cascade）

### 添加新 DNS 记录类型

1. `lib/dns-types.ts`：添加类型字面量、`data` 接口、`RECORD_TYPE_COLORS` 条目
2. `components/DnsRecordForm.tsx`：添加该类型的字段渲染分支

import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log("dns_users 表已有数据，跳过管理员初始化。")
    return
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    console.warn("缺少 SEED_ADMIN_EMAIL 或 SEED_ADMIN_PASSWORD，跳过管理员初始化。")
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { email, passwordHash, role: "ADMIN" },
  })

  console.log(`已初始化管理员账户: ${email}`)
}

main()
  .catch((e) => {
    console.error("Seed 执行失败:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

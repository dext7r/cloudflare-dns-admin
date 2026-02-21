import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto"
import type { Session } from "next-auth"
import { prisma } from "@/lib/prisma"

function getKey(): Buffer {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET 未设置")
  return createHash("sha256").update(secret).digest()
}

export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${data.toString("hex")}`
}

export function decrypt(ciphertext: string): string {
  const parts = ciphertext.split(":")
  if (parts.length !== 3) throw new Error("密文格式无效")
  const [ivHex, authTagHex, dataHex] = parts
  const key = getKey()
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const data = Buffer.from(dataHex, "hex")
  const decipher = createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(data).toString("utf8") + decipher.final("utf8")
}

export async function resolveToken(accountId?: string | null, session?: Session | null): Promise<string> {
  if (accountId) {
    if (session?.user?.role === "VIEWER") {
      const bound = await prisma.userCfAccount.findUnique({
        where: { userId_cfAccountId: { userId: session.user.id, cfAccountId: accountId } },
      })
      if (!bound) throw new Error("无权访问该账号")
    }
    const account = await prisma.cfAccount.findUnique({ where: { id: accountId } })
    if (!account) throw new Error("账号不存在")
    return decrypt(account.encryptedToken)
  }
  if (session?.user?.role === "VIEWER") throw new Error("无权访问：VIEWER 必须指定账号")
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN 未设置")
  return token
}

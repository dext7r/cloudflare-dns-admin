import { prisma } from "@/lib/prisma"

export interface AuditEntry {
  userId: string
  userEmail: string
  action: string
  zoneId?: string
  zoneName?: string
  target?: string
  before?: unknown
  after?: unknown
}

export async function writeAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        userEmail: entry.userEmail,
        action: entry.action,
        zoneId: entry.zoneId,
        zoneName: entry.zoneName,
        target: entry.target,
        before: entry.before !== undefined ? (entry.before as object) : undefined,
        after: entry.after !== undefined ? (entry.after as object) : undefined,
      },
    })
  } catch (err) {
    console.error("[audit] 写入失败:", err instanceof Error ? err.message : err)
  }
}

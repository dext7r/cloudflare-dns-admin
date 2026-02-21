import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { AuditLogManager } from "./AuditLogManager"

export default async function AuditLogPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <AuditLogManager />
    </AdminShell>
  )
}

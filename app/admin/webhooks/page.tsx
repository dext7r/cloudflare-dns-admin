import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { WebhookManager } from "./WebhookManager"

export default async function WebhooksPage() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <WebhookManager />
    </AdminShell>
  )
}

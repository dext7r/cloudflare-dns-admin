import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { AnalyticsManager } from "./AnalyticsManager"

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <AnalyticsManager role={session.user.role} />
    </AdminShell>
  )
}

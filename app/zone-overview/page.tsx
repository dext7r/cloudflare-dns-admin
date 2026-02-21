import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { ZoneOverviewManager } from "./ZoneOverviewManager"

export default async function ZoneOverviewPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <ZoneOverviewManager role={session.user.role} />
    </AdminShell>
  )
}

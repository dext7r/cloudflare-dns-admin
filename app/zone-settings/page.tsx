import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { ZoneSettingsManager } from "./ZoneSettingsManager"

export default async function ZoneSettingsPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <ZoneSettingsManager role={session.user.role} />
    </AdminShell>
  )
}

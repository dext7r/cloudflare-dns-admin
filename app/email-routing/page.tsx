import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { EmailRoutingManager } from "./EmailRoutingManager"

export default async function EmailRoutingPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <EmailRoutingManager role={session.user.role} />
    </AdminShell>
  )
}

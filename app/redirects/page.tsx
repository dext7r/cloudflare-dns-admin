import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminShell } from "@/components/AdminShell"
import { RedirectsManager } from "./RedirectsManager"

export default async function RedirectsPage() {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AdminShell role={session.user.role} user={session.user}>
      <RedirectsManager role={session.user.role} />
    </AdminShell>
  )
}

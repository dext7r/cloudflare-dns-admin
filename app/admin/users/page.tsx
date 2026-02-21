import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { UserManager } from "./UserManager"
import { AdminShell } from "@/components/AdminShell"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <AdminShell role={session.user.role} user={session.user}>
      <UserManager currentUserId={session.user.id} />
    </AdminShell>
  )
}

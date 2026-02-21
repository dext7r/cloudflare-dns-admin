import type { DefaultSession } from "next-auth"

type Role = "ADMIN" | "VIEWER"

declare module "next-auth" {
  interface User {
    id: string
    role: Role
  }

  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
  }
}

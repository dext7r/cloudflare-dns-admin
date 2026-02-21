import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials)
        if (!parsed.success) return null

        const email = parsed.data.email.trim().toLowerCase()
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const matched = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!matched) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ""
        session.user.role = (token.role === "ADMIN" || token.role === "VIEWER")
          ? token.role
          : "VIEWER"
      }
      return session
    },
  },
})

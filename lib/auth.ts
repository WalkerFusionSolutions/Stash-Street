import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Full config with Prisma adapter — used in API routes and server components
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as { role?: string }).role ?? "CUSTOMER"
      }
      return session
    },
    async signIn({ user }) {
      if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        await prisma.user
          .update({ where: { email: user.email }, data: { role: "ADMIN" } })
          .catch(() => null)
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "database" },
})

// Edge-compatible auth config — NO Prisma, uses JWT session only.
// This is imported exclusively by middleware.ts.
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { auth: authEdge } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub ?? ""
        session.user.role = (token.role as string) ?? "CUSTOMER"
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
})

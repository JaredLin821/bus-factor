import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request permission to read repos
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Runs when a user signs in
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as unknown as { id: number }

        // Create user if they don't exist, update if they do
        await prisma.user.upsert({
          where: { githubId: String(githubProfile.id) },
          update: {
            name: user.name,
            email: user.email,
            image: user.image,
            accessToken: account.access_token ?? "",
          },
          create: {
            githubId: String(githubProfile.id),
            name: user.name,
            email: user.email ?? "",
            image: user.image,
            accessToken: account.access_token ?? "",
          },
        })
      }
      return true
    },

    // Runs when creating/refreshing the JWT token
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as unknown as { id: number }
        const dbUser = await prisma.user.findUnique({
          where: { githubId: String(githubProfile.id) },
        })
        if (dbUser) {
          token.userId = dbUser.id
          token.githubId = dbUser.githubId
          token.accessToken = dbUser.accessToken
          token.plan = dbUser.plan
        }
      }
      return token
    },

    // Runs when reading the session on the frontend
    async session({ session, token }) {
      session.user.id = token.userId as string
      session.user.githubId = token.githubId as string
      session.user.accessToken = token.accessToken as string
      session.user.plan = token.plan as string
      return session
    },
  },
})

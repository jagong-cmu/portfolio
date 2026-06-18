import { getServerSession, type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// The single GitHub account allowed into the admin area.
const ALLOWED_GITHUB_LOGIN = "jagong-cmu";

// Shared NextAuth config — imported by the [...nextauth] route handler AND by
// getServerSession() in the admin layout, so both agree on providers/callbacks.
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    // Gate sign-in to a single GitHub login. profile.login is the username.
    async signIn({ profile }) {
      const login = (profile as { login?: string } | undefined)?.login;
      return login === ALLOWED_GITHUB_LOGIN;
    },
  },
};

// True when the current request carries a valid admin session. The signIn
// callback already restricts who can ever get a session, so any session is an
// authorized admin. Used to guard the blog write APIs.
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

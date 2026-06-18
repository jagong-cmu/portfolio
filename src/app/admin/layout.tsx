import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/admin/SignOutButton";

// Guards every route nested under /admin. No session → bounced to the GitHub
// sign-in flow. The signIn callback further restricts which account succeeds.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="mx-auto w-full max-w-wide flex-1 px-6 md:px-10">
      <header className="flex items-center justify-between border-b border-border py-4 font-mono text-xs uppercase tracking-widest text-subtle">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-foreground hover:text-accent">
            Admin
          </Link>
          <span className="text-subtle">·</span>
          <span>{session.user?.name ?? session.user?.email}</span>
        </div>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}

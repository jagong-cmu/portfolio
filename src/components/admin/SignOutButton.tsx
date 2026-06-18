"use client";

import { signOut } from "next-auth/react";

// signOut() hits the NextAuth endpoint directly, so this works without a
// SessionProvider wrapper around the tree.
export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
    >
      Sign out
    </button>
  );
}

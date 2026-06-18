"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setBusy(false);
      alert("Failed to delete post.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-muted transition-colors hover:text-red-600 disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}

import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import Button from "@/components/Button";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

// Dashboard home: every post (drafts included), newest edits first.
export default async function AdminDashboard() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="flex-1">
      <header className="flex flex-wrap items-center justify-between gap-4 py-section pb-12">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Posts
          </h1>
          <p className="mt-4 max-w-content text-lg leading-relaxed text-muted">
            {posts.length} total ·{" "}
            {posts.filter((p) => p.published).length} published
          </p>
        </div>
        <Button href="/admin/posts/new">New post</Button>
      </header>

      <div className="pb-section">
        {posts.length === 0 ? (
          <p className="border-t border-border py-8 text-muted">
            No posts yet. Write your first one.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="grid items-center gap-3 border-b border-border py-5 first:border-t md:grid-cols-[1fr_auto] md:gap-8"
            >
              <div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={
                      "font-mono text-[0.6875rem] uppercase tracking-widest " +
                      (post.published ? "text-accent" : "text-subtle")
                    }
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-subtle">
                  /{post.slug} · updated {format(post.updatedAt, "MMM d, yyyy")}
                </p>
              </div>

              <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

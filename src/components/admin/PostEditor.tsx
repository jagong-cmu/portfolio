"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/slug";

export type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
};

const fieldLabel =
  "block font-mono text-xs uppercase tracking-widest text-subtle";
const fieldInput =
  "mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground " +
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0";

// Editor for both new (no `post`) and existing posts. Left pane is the raw
// Markdown source; right pane renders it live.
export default function PostEditor({ post }: { post?: EditablePost }) {
  const router = useRouter();
  const isNew = !post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  // Track whether the user has hand-edited the slug; until then, follow the title.
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function save() {
    setSaving(true);
    setError(null);

    const payload = { title, slug, excerpt, content, published };
    const res = await fetch(isNew ? "/api/blog" : `/api/blog/${post!.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong while saving.");
      setSaving(false);
    }
  }

  return (
    <div className="pb-section">
      <div className="grid gap-5 py-8">
        <div>
          <label htmlFor="title" className={fieldLabel}>
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Post title"
            className={fieldInput}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="slug" className={fieldLabel}>
              Slug
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="post-slug"
              className={`${fieldInput} font-mono text-sm`}
            />
            <p className="mt-1 font-mono text-xs text-subtle">/blog/{slug || "…"}</p>
          </div>

          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3 pb-1">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                Published
              </span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className={fieldLabel}>
            Excerpt{" "}
            <span className="normal-case tracking-normal text-subtle">
              (optional — auto-derived if blank)
            </span>
          </label>
          <input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A one-line summary for the blog index."
            className={fieldInput}
          />
        </div>
      </div>

      {/* Split editor: raw Markdown on the left, live preview on the right. */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <span className={fieldLabel}>Markdown</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Write your post in Markdown…"
            spellCheck
            className={`${fieldInput} h-[28rem] resize-y font-mono text-sm leading-relaxed`}
          />
        </div>

        <div>
          <span className={fieldLabel}>Preview</span>
          <div className="mt-2 h-[28rem] overflow-y-auto rounded-md border border-border bg-surface px-5 py-4">
            {content.trim() ? (
              <article className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </article>
            ) : (
              <p className="text-subtle">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving || !title.trim()}
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground shadow-sm transition-colors duration-150 hover:bg-accent-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Create post" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

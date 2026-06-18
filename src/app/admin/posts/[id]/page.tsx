import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <main className="flex-1">
      <header className="py-section pb-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Edit post
        </h1>
      </header>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          published: post.published,
        }}
      />
    </main>
  );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";

type RouteContext = { params: Promise<{ id: string }> };

// Update a post. Toggling `published` stamps publishedAt the first time it goes live.
export async function PATCH(request: Request, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const title = body.title !== undefined ? String(body.title).trim() : existing.title;
  const content = body.content !== undefined ? body.content : existing.content;
  const slug = body.slug !== undefined ? slugify(body.slug) || existing.slug : existing.slug;
  const published = body.published !== undefined ? Boolean(body.published) : existing.published;
  const excerpt = body.excerpt !== undefined ? String(body.excerpt).trim() : existing.excerpt;

  // Set publishedAt when transitioning draft → published; keep the original otherwise.
  const publishedAt =
    published && !existing.publishedAt ? new Date() : existing.publishedAt;

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: { title, slug, content, published, excerpt, publishedAt },
    });
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: `A post with slug "${slug}" already exists.` },
        { status: 409 },
      );
    }
    throw err;
  }
}

// Delete a post.
export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

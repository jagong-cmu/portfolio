import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { slugify } from "@/lib/slug";

// List all posts (published + drafts) for the admin dashboard.
export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(posts);
}

// Create a post. Writes require an active admin session.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = (body.title ?? "").trim();
  const content = body.content ?? "";

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = (body.slug ? slugify(body.slug) : slugify(title)) || "untitled";
  const published = Boolean(body.published);

  // Derive an excerpt from the content if none was supplied.
  const excerpt =
    (body.excerpt ?? "").trim() ||
    content.replace(/[#*`>_~\-]/g, "").trim().slice(0, 160);

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        publishedAt: published ? new Date() : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    // Unique-constraint collision on slug is the common failure here.
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: `A post with slug "${slug}" already exists.` },
        { status: 409 },
      );
    }
    throw err;
  }
}

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}

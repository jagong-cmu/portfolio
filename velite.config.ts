import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      excerpt: s.string(),
      published: s.boolean().default(true),
      // compiled MDX (function-body string, rendered by MDXContent)
      content: s.mdx(),
      // { readingTime, wordCount } derived from the body
      metadata: s.metadata(),
      // flattened path, e.g. "posts/hello-world"
      slug: s.path(),
    })
    .transform((data) => {
      const slug = data.slug.replace(/^posts\//, "");
      return { ...data, slug, url: `/blog/${slug}` };
    }),
});

export default defineConfig({
  root: "content",
  collections: { posts },
  mdx: {
    // keep output lean; add rehype/remark plugins here later if needed
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

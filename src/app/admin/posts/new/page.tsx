import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <main className="flex-1">
      <header className="py-section pb-4">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          New post
        </h1>
      </header>
      <PostEditor />
    </main>
  );
}

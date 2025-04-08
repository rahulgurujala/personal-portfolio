import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { VisitorCounter } from "@/components/blog/VisitorCounter";
import { generateMetadata as seoMetadata } from "@/components/shared/SEO";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post || post.length === 0 || !post[0].published) {
    return seoMetadata({
      title: "Post Not Found",
      description: "The requested blog post could not be found",
      noIndex: true,
    });
  }

  const currentPost = post[0];
  const postTitle = `${currentPost.title} | Developer Portfolio`;
  const postDescription =
    currentPost.excerpt || `Read ${currentPost.title} on Developer Portfolio`;

  return seoMetadata({
    title: postTitle,
    description: postDescription,
    ogImage: currentPost.coverImage || undefined,
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${currentPost.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post || post.length === 0 || !post[0].published) {
    notFound();
  }

  const currentPost = post[0];

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{currentPost.title}</h1>
          <div className="flex items-center justify-between text-muted-foreground">
            <time dateTime={currentPost.createdAt?.toISOString()}>
              {formatDistance(currentPost.createdAt ?? new Date(), new Date(), {
                addSuffix: true,
              })}
            </time>
            <VisitorCounter
              slug={currentPost.slug}
              initialCount={currentPost.views ?? 0}
            />
          </div>
        </div>

        {currentPost.coverImage && (
          <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden">
            <Image
              src={currentPost.coverImage}
              alt={currentPost.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: currentPost.content }}
        />
      </article>
    </main>
  );
}

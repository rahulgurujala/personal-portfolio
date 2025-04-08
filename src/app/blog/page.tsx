import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";

export const metadata = {
  title: "Blog | Developer Portfolio",
  description: "Read the latest articles about web development and technology",
};

export default async function BlogPage() {
  // Get only published blog posts
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.createdAt));

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">No posts yet</h2>
          <p className="text-muted-foreground">
            Check back soon for new content!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="border rounded-lg overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
                {post.coverImage && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="text-sm text-muted-foreground mt-auto flex items-center justify-between">
                    <span>
                      {formatDistance(
                        post.createdAt ? new Date(post.createdAt) : new Date(),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                    <span>{post.views} views</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

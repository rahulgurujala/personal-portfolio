import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const published = url.searchParams.get("published");

    let query = db.select().from(blogPosts);

    // Filter by published status if specified
    if (published === "true") {
      // @ts-expect-error: Cannot invoke an object which is possibly 'null'.
      query = query.where(eq(blogPosts.published, true));
    }

    // Order by creation date, newest first
    const posts = await query.orderBy(desc(blogPosts.createdAt));

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST a new blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, body.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new post
    const result = await db
      .insert(blogPosts)
      .values({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        published: body.published || false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      post: result[0],
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

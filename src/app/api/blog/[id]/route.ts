import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET a specific blog post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if ID is a number (database ID) or string (slug)
    const isNumeric = /^\d+$/.test(params.id);

    let post;
    if (isNumeric) {
      // Find by ID
      post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, parseInt(params.id)))
        .limit(1);
    } else {
      // Find by slug
      post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, params.id))
        .limit(1);
    }

    if (!post || post.length === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: post[0] });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT to update a blog post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if post exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(params.id)))
      .limit(1);

    if (!existingPost || existingPost.length === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and already exists
    if (body.slug !== existingPost[0].slug) {
      const slugExists = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, body.slug))
        .limit(1);

      if (slugExists.length > 0) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update post
    const result = await db
      .update(blogPosts)
      .set({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || null,
        content: body.content,
        coverImage: body.coverImage || null,
        published: body.published || false,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, parseInt(params.id)))
      .returning();

    return NextResponse.json({
      success: true,
      post: result[0],
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE a blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if post exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, parseInt(params.id)))
      .limit(1);

    if (!existingPost || existingPost.length === 0) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete post
    await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(params.id)));

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

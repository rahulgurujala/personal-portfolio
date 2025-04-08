import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitorStats, blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();

    if (!page) {
      return NextResponse.json({ error: "Page is required" }, { status: 400 });
    }

    // Check if page exists in visitor stats
    const existingStats = await db
      .select()
      .from(visitorStats)
      .where(eq(visitorStats.page, page));

    // If it's a blog post, also update the view count on the post
    if (page.startsWith('/blog/')) {
      const slug = page.replace('/blog/', '');
      await db
        .update(blogPosts)
        .set({
          views: (existingStats[0]?.count || 0) + 1,
        })
        .where(eq(blogPosts.slug, slug));
    }

    if (existingStats.length > 0) {
      // Update existing page count
      await db
        .update(visitorStats)
        .set({
          count: existingStats[0]?.count ? existingStats[0].count + 1 : 1,
          lastVisit: new Date(),
        })
        .where(eq(visitorStats.page, page));

      return NextResponse.json({
        success: true,
        count: existingStats[0]?.count ? existingStats[0].count + 1 : 1,
      });
    } else {
      // Create new page count
      const result = await db
        .insert(visitorStats)
        .values({ page, count: 1, lastVisit: new Date() })
        .returning({ count: visitorStats.count });

      return NextResponse.json({
        success: true,
        count: result[0].count,
      });
    }
  } catch (error) {
    console.error("Error updating visitor count:", error);
    return NextResponse.json(
      { error: "Failed to update visitor count" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");

    if (!page) {
      // Return all stats if no page specified
      const stats = await db.select().from(visitorStats);
      return NextResponse.json({ success: true, stats });
    }

    // Get stats for specific page
    const pageStats = await db
      .select()
      .from(visitorStats)
      .where(eq(visitorStats.page, page));

    if (pageStats.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    return NextResponse.json({
      success: true,
      count: pageStats[0].count,
    });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json(
      { error: "Failed to fetch visitor count" },
      { status: 500 }
    );
  }
}

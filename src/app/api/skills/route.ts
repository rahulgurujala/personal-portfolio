import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills, profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET all skills
export async function GET() {
  try {
    const allSkills = await db.select().from(skills).orderBy(skills.name);
    return NextResponse.json({ success: true, skills: allSkills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST a new skill (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .then(rows => rows[0] || null);

    if (!userProfile?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.category || !body.proficiency) {
      return NextResponse.json(
        { error: "Name, category, and proficiency are required" },
        { status: 400 }
      );
    }

    // Create new skill
    const result = await db
      .insert(skills)
      .values({
        name: body.name,
        icon: body.icon || null,
        category: body.category,
        proficiency: body.proficiency,
      })
      .returning();

    return NextResponse.json({
      success: true,
      skill: result[0],
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
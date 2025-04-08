import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { skills, profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET a specific skill
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(params.id)))
      .then(rows => rows[0] || null);

    if (!skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    );
  }
}

// PUT (update) a skill
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!body.name || !body.category || body.proficiency === undefined) {
      return NextResponse.json(
        { error: "Name, category, and proficiency are required" },
        { status: 400 }
      );
    }

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(params.id)))
      .then(rows => rows[0] || null);

    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Update skill
    const result = await db
      .update(skills)
      .set({
        name: body.name,
        icon: body.icon || null,
        category: body.category,
        proficiency: body.proficiency,
      })
      .where(eq(skills.id, parseInt(params.id)))
      .returning();

    return NextResponse.json({
      success: true,
      skill: result[0],
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 }
    );
  }
}

// DELETE a skill
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if skill exists
    const existingSkill = await db
      .select()
      .from(skills)
      .where(eq(skills.id, parseInt(params.id)))
      .then(rows => rows[0] || null);

    if (!existingSkill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Delete skill
    await db
      .delete(skills)
      .where(eq(skills.id, parseInt(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
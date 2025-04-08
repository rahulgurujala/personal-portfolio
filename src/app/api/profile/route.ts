import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// GET handler to fetch profile data
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the profile from the database
    const profileDetails = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .then(rows => rows[0] || null);

    return NextResponse.json({ success: true, profile: profileDetails });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT handler to update profile data
export async function PUT(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .then(rows => rows[0] || null);

    if (existingProfile) {
      // Update existing profile
      await db
        .update(profile)
        .set({
          name: body.name,
          title: body.title,
          bio: body.bio,
          avatar: body.avatar,
          email: body.email,
          github: body.github,
          linkedin: body.linkedin,
          twitter: body.twitter,
          resume: body.resume,
          updatedAt: new Date(),
        })
        .where(eq(profile.userId, userId));
    } else {
      // Create new profile
      await db.insert(profile).values({
        userId,
        name: body.name,
        title: body.title,
        bio: body.bio,
        avatar: body.avatar,
        email: body.email,
        github: body.github,
        linkedin: body.linkedin,
        twitter: body.twitter,
        resume: body.resume,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

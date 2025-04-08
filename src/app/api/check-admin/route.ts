import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ isAdmin: false });
    }

    // Check if user is admin
    const userProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .then(rows => rows[0] || null);

    return NextResponse.json({ isAdmin: !!userProfile?.isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
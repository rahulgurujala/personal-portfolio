import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const userProfile = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, user.id))
    .then((rows) => rows[0] || null);

  // If no profile or not admin, redirect to home
  if (!userProfile?.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <UserButton afterSignOutUrl="/" />
          </div>

          <nav className="space-y-2 flex-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/admin/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/admin/profile">Profile</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/admin/projects">Projects</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/admin/blog">Blog Posts</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/admin/settings">Settings</Link>
            </Button>
          </nav>

          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">View Site</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}

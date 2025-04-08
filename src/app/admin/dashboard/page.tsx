import { db } from "@/lib/db";
import { blogPosts, projects, visitorStats } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { count } from "drizzle-orm";

export default async function AdminDashboard() {
  // Get counts
  const [blogCount] = await db.select({ value: count() }).from(blogPosts);
  const [projectCount] = await db.select({ value: count() }).from(projects);

  // Get visitor stats
  const visitorData = await db.select().from(visitorStats);
  const totalVisits = visitorData.reduce(
    (total, stat) => total + (stat.count ?? 0),
    0
  );

  // Get recent blog posts
  const recentPosts = await db
    .select()
    .from(blogPosts)
    .orderBy(blogPosts.createdAt)
    .limit(5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogCount.value}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projectCount.value}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>
              Your most recently created blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border-b pb-2 last:border-0">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {post.published ? "Published" : "Draft"} •{" "}
                    {post.createdAt?.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
            <CardDescription>Your most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitorData
                .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
                .slice(0, 5)
                .map((stat) => (
                  <div key={stat.id} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{stat.page}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.count} visits • Last visit:{" "}
                      {stat.lastVisit?.toLocaleDateString() ?? "Never"}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

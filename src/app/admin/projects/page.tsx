import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";

export default async function AdminProjects() {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(projects.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    project.featured
                      ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
                  }`}
                >
                  {project.featured ? "Featured" : "Not Featured"}
                </span>
              </TableCell>
              <TableCell>{project.order}</TableCell>
              <TableCell>
                {formatDistance(
                  project.createdAt ? new Date(project.createdAt) : new Date(),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {allProjects.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No projects found. Create your first project!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
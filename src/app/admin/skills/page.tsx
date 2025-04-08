import { db } from "@/lib/db";
import { skills } from "@/lib/db/schema";
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

export default async function AdminSkills() {
  const allSkills = await db.select().from(skills).orderBy(skills.name);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button asChild>
          <Link href="/admin/skills/new">New Skill</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSkills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell className="font-medium">{skill.name}</TableCell>
              <TableCell className="capitalize">{skill.category}</TableCell>
              <TableCell>{skill.icon}</TableCell>
              <TableCell>{skill.proficiency}%</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/skills/${skill.id}`}>Edit</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {allSkills.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No skills found. Create your first skill!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { formatDistance } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MessagesPage() {
  const messages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>
                <a 
                  href={`mailto:${message.email}`}
                  className="text-primary hover:underline"
                >
                  {message.email}
                </a>
              </TableCell>
              <TableCell>{message.subject}</TableCell>
              <TableCell>
                <Badge variant={message.read ? "outline" : "default"}>
                  {message.read ? "Read" : "Unread"}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistance(
                  message.createdAt ? new Date(message.createdAt) : new Date(),
                  new Date(),
                  { addSuffix: true }
                )}
              </TableCell>
              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/messages/${message.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {messages.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No messages yet. When visitors send you messages, they will appear here.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
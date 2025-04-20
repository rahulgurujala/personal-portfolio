import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import MarkAsReadButton from "@/components/admin/MarkAsReadButton";

export default async function MessagePage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  // Get the message
  const messages = await db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.id, id));

  const message = messages[0];

  if (!message) {
    return notFound();
  }

  // Mark as read if not already
  if (!message.read) {
    await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/messages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Message Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{message.subject}</CardTitle>
            <MarkAsReadButton id={message.id} isRead={message.read === true} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">From</p>
              <p className="font-medium">{message.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{message.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">
                {message.createdAt
                  ? format(new Date(message.createdAt), "PPP 'at' p")
                  : "Unknown"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">Message</p>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href={`mailto:${message.email}`}>
              <Mail className="mr-2 h-4 w-4" />
              Reply via Email
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

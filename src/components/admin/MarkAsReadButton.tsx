"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MailOpen, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MarkAsReadButtonProps {
  id: number;
  isRead: boolean;
}

export default function MarkAsReadButton({ id, isRead }: MarkAsReadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState(isRead);
  const router = useRouter();

  const handleToggleRead = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: !read }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }

      setRead(!read);
      toast.success(
        read ? "Message marked as unread" : "Message marked as read"
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleRead}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : read ? (
        <MailOpen className="h-4 w-4 mr-2" />
      ) : (
        <Mail className="h-4 w-4 mr-2" />
      )}
      {read ? "Mark as Unread" : "Mark as Read"}
    </Button>
  );
}
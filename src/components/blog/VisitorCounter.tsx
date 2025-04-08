"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface VisitorCounterProps {
  slug: string;
  initialCount: number;
}

export function VisitorCounter({ slug, initialCount }: VisitorCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const response = await fetch("/api/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: `/blog/${slug}` }),
        });
        
        const data = await response.json();
        if (data.success) {
          setCount(data.count);
        }
      } catch (error) {
        console.error("Failed to update view count:", error);
      }
    };

    updateViewCount();
  }, [slug]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{count} views</span>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistance } from "date-fns";

interface BlogPostProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    published: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const [views, setViews] = useState(post.views);

  useEffect(() => {
    // Update view count when component mounts
    const updateViewCount = async () => {
      try {
        const response = await fetch("/api/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ page: `/blog/${post.slug}` }),
        });
        
        const data = await response.json();
        if (data.success) {
          setViews(data.count);
        }
      } catch (error) {
        console.error("Failed to update view count:", error);
      }
    };

    updateViewCount();
  }, [post.slug]);

  return (
    <Card className="overflow-hidden">
      {post.coverImage && (
        <div className="relative w-full h-64">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            {formatDistance(new Date(post.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
          <span className="mx-2">•</span>
          <span>{views} views</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none" 
             dangerouslySetInnerHTML={{ __html: post.content }} />
      </CardContent>
    </Card>
  );
}
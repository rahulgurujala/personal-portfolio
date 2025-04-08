"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { RichTextEditor } from "@/components/blog/RichTextEditor";
import { ImageUpload } from "@/components/shared/ImageUpload";

export default function BlogPostEditor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew = params.id === "new";

  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    published: false,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      // Fetch existing post data
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/blog/${params.id}`);
          const data = await response.json();

          if (data.success) {
            setPost(data.post);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [isNew, params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setPost((prev) => ({ ...prev, published: checked }));
  };

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    setPost((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? "/api/blog" : `/api/blog/${params.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/blog");
      } else {
        console.error("Error saving post:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isNew ? "Create New Post" : "Edit Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                placeholder="Post title"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSlug}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Generate
                </Button>
              </div>
              <Input
                id="slug"
                name="slug"
                value={post.slug}
                onChange={handleChange}
                placeholder="post-url-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt || ""}
                onChange={handleChange}
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <ImageUpload
                value={post.coverImage || ""}
                onChange={(url) =>
                  setPost((prev) => ({ ...prev, coverImage: url }))
                }
                label="Cover Image"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={post.content}
                onChange={handleContentChange}
                placeholder="Write your post content here..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="published"
                checked={post.published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="published">Publish post</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Post"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

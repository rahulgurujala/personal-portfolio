"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {value ? (
        <div className="relative">
          <Image
            src={value}
            alt="Uploaded image"
            className="max-h-64 rounded-md border object-contain w-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag and drop an image, or click to browse
            </p>
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Uploading...</span>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={isUploading}
              >
                Upload Image
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
              </Button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL directly"
          className="flex-1"
        />
      </div>
    </div>
  );
}

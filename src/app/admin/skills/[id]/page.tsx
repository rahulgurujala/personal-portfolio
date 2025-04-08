"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { use } from "react";

export default function SkillEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const isNew = id === "new";

  const [skill, setSkill] = useState({
    name: "",
    icon: "",
    category: "frontend",
    proficiency: 50,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      // Fetch existing skill data
      const fetchSkill = async () => {
        try {
          const response = await fetch(`/api/skills/${id}`);
          const data = await response.json();

          if (data.success) {
            setSkill(data.skill);
          }
        } catch (error) {
          console.error("Error fetching skill:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSkill();
    } else {
      setLoading(false);
    }
  }, [isNew, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSkill((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSkill((prev) => ({ ...prev, category: value }));
  };

  const handleProficiencyChange = (value: number[]) => {
    setSkill((prev) => ({ ...prev, proficiency: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew ? "/api/skills" : `/api/skills/${id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skill),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/skills");
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/skills")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isNew ? "Add New Skill" : "Edit Skill"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Skill Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={skill.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji or symbol)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={skill.icon}
                  onChange={handleChange}
                  placeholder="e.g. ⚛️, 🔥, or JS"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={skill.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="proficiency">Proficiency</Label>
                <span className="text-sm text-muted-foreground">
                  {skill.proficiency}%
                </span>
              </div>
              <Slider
                id="proficiency"
                min={1}
                max={100}
                step={1}
                value={[skill.proficiency]}
                onValueChange={handleProficiencyChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Skill"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

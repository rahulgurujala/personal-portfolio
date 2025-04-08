"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteTitle: "Developer Portfolio",
    siteDescription: "Personal portfolio and blog",
    enableBlog: true,
    enableProjects: true,
    enableContact: true,
    analyticsId: "",
    customCss: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch settings from an API
    // For now, we'll just simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
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
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  Configure the basic settings for your portfolio site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    placeholder="Your Portfolio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    placeholder="A brief description of your site"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
                <CardDescription>
                  Enable or disable features on your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBlog">Blog</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable the blog section on your portfolio
                    </p>
                  </div>
                  <Switch
                    id="enableBlog"
                    checked={settings.enableBlog}
                    onCheckedChange={handleSwitchChange("enableBlog")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableProjects">Projects</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable the projects showcase on your portfolio
                    </p>
                  </div>
                  <Switch
                    id="enableProjects"
                    checked={settings.enableProjects}
                    onCheckedChange={handleSwitchChange("enableProjects")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableContact">Contact Form</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable the contact form on your portfolio
                    </p>
                  </div>
                  <Switch
                    id="enableContact"
                    checked={settings.enableContact}
                    onCheckedChange={handleSwitchChange("enableContact")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced settings for your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analyticsId">Analytics ID</Label>
                  <Input
                    id="analyticsId"
                    name="analyticsId"
                    value={settings.analyticsId}
                    onChange={handleChange}
                    placeholder="e.g. G-XXXXXXXXXX"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your Google Analytics measurement ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCss">Custom CSS</Label>
                  <textarea
                    id="customCss"
                    name="customCss"
                    value={settings.customCss}
                    onChange={handleChange}
                    placeholder="/* Add your custom CSS here */"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-sm text-muted-foreground">
                    Add custom CSS to customize the appearance of your portfolio
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

"use client";

import { SignIn } from "@clerk/nextjs";
import { ArrowLeft, Code, Terminal } from "lucide-react";
import Link from "next/link";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="relative h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Terminal className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                <Code className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to access your developer dashboard
          </p>
        </div>

        <div className="bg-card border rounded-lg shadow-sm p-6">
          <SignIn
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
              elements: {
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                formFieldLabel: "text-foreground",
                formFieldInput:
                  "bg-background border border-input rounded-md focus:ring-1 focus:ring-primary",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
          />
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Unleash the power of Admin with our user-friendly platform.</p>
        </div>
      </div>
    </div>
  );
}

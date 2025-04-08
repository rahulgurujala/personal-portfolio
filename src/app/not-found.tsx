"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const [codeLines, setCodeLines] = useState<string[]>([]);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Generate "code" animation
    const errorCode = [
      "// ERROR 404: Page Not Found",
      "function findPage(path) {",
      "  try {",
      "    const page = router.resolve(path);",
      "    return page;",
      "  } catch (error) {",
      "    console.error(`Page ${path} not found`);",
      "    return redirectTo('/');",
      "  }",
      "}",
      "",
      "// Attempting to recover...",
      "const possibleRoutes = getSimilarRoutes(path);",
      "if (possibleRoutes.length > 0) {",
      "  suggestAlternatives(possibleRoutes);",
      "} else {",
      "  redirectToHomePage();",
      "}",
    ];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < errorCode.length) {
        setCodeLines((prev) => [...prev, errorCode[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>

        <div className="mt-8 bg-muted p-6 rounded-lg text-left overflow-hidden">
          <pre className="font-mono text-sm overflow-x-auto">
            <code>
              {codeLines.map((line, index) => (
                <div key={index} className="line">
                  <span className="text-muted-foreground mr-2">
                    {index + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
              {codeLines.length === 17 && (
                <div className="line mt-4 text-primary">
                  <span className="text-muted-foreground mr-2">{18}</span>
                  <span className="animate-pulse">
                    {`// Redirecting in ${countdown} seconds...`}
                  </span>
                </div>
              )}
            </code>
          </pre>
        </div>

        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

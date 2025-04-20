import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/blog(.*)",
  "/projects(.*)",
  "/contact",
  "/api/upload",
  "/api/blog(.*)",
  "/api/projects(.*)",
  "/api/profile",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is public or user is authenticated, allow the request
  if (isPublicRoute(req) || (await auth()).userId) {
    return;
  }

  // If not authenticated and route isn't public, redirect to sign-in
  if (!(await auth()).userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    // Create a new NextResponse for redirection instead of modifying an existing Response
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    // Explicitly exclude webhook route since ignoredRoutes isn't available
    "/api/webhook(.*)",
  ],
};

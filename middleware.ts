import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This locks the dashboard and any sub-pages
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
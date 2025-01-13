import { auth as middleware } from "@acme/auth";

export default middleware((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  if (!isAuthenticated && !["/login"].includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

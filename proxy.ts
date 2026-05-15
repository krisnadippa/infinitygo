import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage && !isLoggedIn) {
    const url = new URL("/login", req.nextUrl);
    if (url.hostname === "0.0.0.0") url.hostname = "localhost";
    return Response.redirect(url);
  }

  if (isAuthPage && isLoggedIn) {
    const url = new URL("/admin/dashboard", req.nextUrl);
    if (url.hostname === "0.0.0.0") url.hostname = "localhost";
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

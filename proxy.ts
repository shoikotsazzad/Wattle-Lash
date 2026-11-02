import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

// Optimistic gate only (signature + role, no DB). Every admin/account API route
// re-checks the user in MongoDB.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = verifyToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (session?.role !== "admin") {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account") && !["/account/login", "/account/register"].includes(pathname)) {
    if (!session) {
      const url = new URL("/account/login", request.url);
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  if (pathname.startsWith("/admin")) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};

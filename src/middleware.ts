import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://paisebato-production.up.railway.app";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public onboarding pages should be accessible without auth unless authenticated
  const isOnboarding = pathname.startsWith("/onboarding");
  const isDashboard = pathname.startsWith("/dashboard");

  const token = req.cookies.get("auth_token")?.value;
  const tokenType = req.cookies.get("auth_token_type")?.value || "Bearer";

  if (!token) {
    // No token: allow onboarding, block dashboard
    if (isOnboarding) return NextResponse.next();
    if (!isDashboard) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/onboarding/login";
    return NextResponse.redirect(url);
  }

  // Validate token via /api/me
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: `${tokenType} ${token}` },
      cache: "no-store",
    });
    console.log("res->>", res.ok);

    console.log("Status:", res.status);
    console.log("res.ok:", res.ok);
    console.log("Headers:", res.headers);

    const body = await res.text(); // Or use res.json() if you expect JSON
    console.log("Response Body:", body);

    if (res.ok) {
      // If authenticated and on onboarding pages, redirect to home
      if (isOnboarding) {
        return NextResponse.redirect(new URL("/dashboard/home", req.url));
      }
      return NextResponse.next();
    }
  } catch (error) {
    console.log("error->>", error);
    // network or other failure -> treat as unauthenticated
  }

  const url = req.nextUrl.clone();
  url.pathname = "/onboarding/login";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on most routes, exclude Next internals and API
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

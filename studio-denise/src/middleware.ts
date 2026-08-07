import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "clube_session";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "dev-insecure-secret-change-me-please-32b";
  return new TextEncoder().encode(s);
}

/** Protege /dashboard (qualquer sessão) e /admin (apenas equipe). */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  let payload: { role?: string } | null = null;
  if (token) {
    try {
      const verified = await jwtVerify(token, secret());
      payload = verified.payload as { role?: string };
    } catch {
      payload = null;
    }
  }

  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && payload.role === "CLIENT") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

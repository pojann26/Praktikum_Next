import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_jwt_key_nextjs_praktikum_2026"
);

// Protected routes requiring active login session
const protectedRoutes = ["/dashboard"];

// Auth routes accessible only to guests
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session")?.value;

  let isVerified = false;

  if (sessionToken) {
    try {
      await jwtVerify(sessionToken, SECRET_KEY);
      isVerified = true;
    } catch {
      isVerified = false;
    }
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated user trying to access protected route -> /login
  if (isProtectedRoute && !isVerified) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user trying to access guest auth route -> /dashboard
  if (isAuthRoute && isVerified) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

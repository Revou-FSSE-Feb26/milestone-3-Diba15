import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ["/cart", "/profile"];
const ADMIN_ROUTES = ["/dashboard"];
const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    const isAuthenticated = !!accessToken || !!refreshToken;

    if (!isAuthenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isAuthenticated && AUTH_PAGES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    if (pathname.startsWith("/api")) {
        const origin = request.headers.get('origin') || request.headers.get('referer');
        const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        if (!origin || !origin.includes(allowedDomain)) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Forbidden Access' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart",
        "/profile",
        "/dashboard/:path*",
        "/login",
        "/register",
        "/api/:path*"
    ]
}
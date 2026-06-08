import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ["/cart", "/dashboard"];

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get("refreshToken")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    if (!token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        // Alihkan mereka ke halaman utama atau dashboard
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart",
        "/dashboard"
    ]
}
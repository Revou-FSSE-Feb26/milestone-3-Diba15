import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ["/cart", "/profile"];
const ADMIN_ROUTES = ["/dashboard"];
const AUTH_PAGES = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const token = request.cookies.get("accessToken")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    if (!token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        // Alihkan mereka ke halaman utama atau dashboard
        return NextResponse.redirect(new URL("/", request.url));
    } 
    
    if (token && AUTH_PAGES.some((route) => pathname.startsWith(route))) {
        // Alihkan mereka ke halaman utama atau dashboard
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
        // Jika belum login, tendang ke login
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Contoh validasi role: Jika role adalah "user" biasa, dilarang masuk dashboard admin
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    // Cek akses api dari aplikasi lain
    if (pathname.startsWith("/api")) {
        const origin = request.headers.get('origin') || request.headers.get('referer');
        const allowedDomain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // Blokir jika request datang dari aplikasi/domain lain (misal Postman atau website asing)
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
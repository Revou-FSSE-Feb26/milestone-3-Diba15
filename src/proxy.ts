import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_ROUTES = ["/cart"];
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

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/cart",
        "/dashboard/:path*",
        "/login",
        "/register"
    ]
}
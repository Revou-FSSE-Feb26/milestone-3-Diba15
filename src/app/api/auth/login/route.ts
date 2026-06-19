import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axiosServer from "@/lib/axiosServer";
import axios from "axios";

export async function POST(request: Request) {
    try {
        // 1. Validasi Input Awal
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
        }

        // 2. Request Login ke Backend
        const loginResponse = await axiosServer.post(`/auth/login`, { email, password });
        const { access_token, refresh_token } = loginResponse.data;

        // 3. Ambil Data Profile
        const profileResponse = await axiosServer.get(`/auth/profile`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const userData = profileResponse.data;

        // 4. Validasi Role (Gunakan 403 Forbidden karena kredensial benar tapi akses ditolak)
        const VALID_ROLES = ["admin", "user", "customer"];
        if (!VALID_ROLES.includes(userData.role)) {
            return NextResponse.json({ error: "Akses ditolak: Role tidak valid" }, { status: 403 });
        }

        // 5. Konfigurasi dan Set Cookies (DRY pattern)
        const cookieStore = await cookies();
        const isProd = process.env.NODE_ENV === "production";

        const baseCookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict" as const, // As const untuk memastikan tipe literal bagi TypeScript
            path: "/"
        };

        cookieStore.set("refreshToken", refresh_token, {
            ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 // 7 Hari
        });
        cookieStore.set("accessToken", access_token, {
            ...baseCookieOptions, maxAge: 60 * 60 // 1 Jam
        });
        cookieStore.set("user_role", userData.role, {
            ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 // 7 Hari
        });

        return NextResponse.json({ success: true, user: userData });

    } catch (error: unknown) {
        console.error("Route Handler Login Error:", error);

        // Menangkap error spesifik dari (dari API Eksternal)
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 500;
            const message = error.response?.data?.message || "Error on login";

            return NextResponse.json({ error: message }, { status: statusCode });
        }

        // Menangkap error lain (misal: gagal parse JSON)
        return NextResponse.json({ error: "Credentials invalid" }, { status: 400 });
    }
}
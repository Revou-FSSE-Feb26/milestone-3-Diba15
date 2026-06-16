import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const loginResponse = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { access_token, refresh_token } = loginResponse.data;

        const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const userData = profileResponse.data;

        const cookieStore = await cookies();
        const isProd = process.env.NODE_ENV === "production";

        cookieStore.set("refreshToken", refresh_token, {
            httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 60 * 60 * 24 * 7, path: "/"
        });
        cookieStore.set("accessToken", access_token, {
            httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 60 * 60, path: "/"
        });
        cookieStore.set("user_role", userData.role, {
            httpOnly: true, secure: isProd, sameSite: "strict", maxAge: 60 * 60 * 24 * 7, path: "/"
        });

        return NextResponse.json({ success: true, user: userData });
    } catch (error: unknown) {
        console.error("Error logging in user:", error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Login failed" }, { status: 401 });
        }
        return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
    }
}
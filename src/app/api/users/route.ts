import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
    try {
        const authHeader = await getAuthHeader();
        const response = await axios.get(`${API_URL}/users`, { headers: authHeader });
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        console.error("Error inside /api/user Route Handler:", error);
        return NextResponse.error();
    }
}
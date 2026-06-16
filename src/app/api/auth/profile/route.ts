import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { error: "Unauthorized: No access token found" },
                { status: 401 }
            );
        }

        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return NextResponse.json(response.data);

    } catch (error: unknown) {
        console.error("Error inside /api/profile Route Handler:", error);

        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.message || "Failed to fetch profile from server" },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
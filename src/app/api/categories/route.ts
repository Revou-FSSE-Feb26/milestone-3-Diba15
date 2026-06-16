import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

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
        const response = await axios.get(`${API_URL}/categories`);

        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error fetching categories" }, { status: 500 });
        }

        return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headers = await getAuthHeader();

        const response = await axios.post(`${API_URL}/categories`, body, { headers });
        return NextResponse.json({ success: true, category: response.data });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error creating category" }, { status: 400 });
        }

        return NextResponse.json({ error: "Error creating category" }, { status: 400 });
    }
}
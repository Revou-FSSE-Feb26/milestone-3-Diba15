import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

interface GET_PARAMS {
    offset?: number;
    limit?: number;
    title?: string;
    categoryId?: number;
}

async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const offset = searchParams.get("offset");
        const limit = searchParams.get("limit");
        const title = searchParams.get("title");
        const categoryId = searchParams.get("categoryId");

        const params: GET_PARAMS = {};
        if (offset) params.offset = Number(offset);
        if (limit) params.limit = Number(limit);
        if (title) params.title = title;
        if (categoryId) params.categoryId = Number(categoryId);

        const response = await axios.get(`${API_URL}/products`, { params });

        return NextResponse.json(response.data);
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error fetching products" }, { status: 500 });
        }

        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const headers = await getAuthHeader();

        const response = await axios.post(`${API_URL}/products`, body, { headers });
        return NextResponse.json({ success: true, product: response.data });
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error creating product" }, { status: 400 });
        }

        return NextResponse.json({ error: "Error creating product" }, { status: 400 });
    }
}
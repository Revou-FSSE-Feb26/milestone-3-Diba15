import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
}

async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await axios.get(`${API_URL}/products/${id}`);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Failed to fetch product details" }, { status: 500 });
        }

        return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const headers = await getAuthHeader();
        const { id } = await params; 

        const response = await axios.put(`${API_URL}/products/${id}`, body, { headers });
        return NextResponse.json({ success: true, product: response.data });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Failed to update product" }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to update product" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const headers = await getAuthHeader();
        const { id } = await params;

        await axios.delete(`${API_URL}/products/${id}`, { headers });
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Failed to delete product" }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
    }
}
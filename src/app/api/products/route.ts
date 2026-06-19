import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import axiosServer from "@/lib/axiosServer";

interface GET_PARAMS {
    offset?: number;
    limit?: number;
    title?: string;
    categoryId?: number;
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

        const response = await axiosServer.get(`/products`, { params });

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

        const response = await axiosServer.post(`/products`, body);
        return NextResponse.json({ success: true, product: response.data });
    } catch (error: unknown) {

        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error creating product" }, { status: 400 });
        }

        return NextResponse.json({ error: "Error creating product" }, { status: 400 });
    }
}
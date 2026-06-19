import { NextResponse } from "next/server";
import axios from "axios";
import axiosServer from "@/lib/axiosServer";

export async function GET() {
    try {
        const response = await axiosServer.get(`/categories`);

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

        const response = await axiosServer.post(`/categories`, body);
        return NextResponse.json({ success: true, category: response.data });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error creating category" }, { status: 400 });
        }

        return NextResponse.json({ error: "Error creating category" }, { status: 400 });
    }
}
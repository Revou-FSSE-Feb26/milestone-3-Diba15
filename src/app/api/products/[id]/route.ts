import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import axiosServer from "@/lib/axiosServer";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await axiosServer.get(`/products/${id}`);
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
        const { id } = await params; 

        const response = await axiosServer.put(`/products/${id}`, body);
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
        const { id } = await params;

        await axiosServer.delete(`/products/${id}`);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Failed to delete product" }, { status: 400 });
        }

        return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
    }
}
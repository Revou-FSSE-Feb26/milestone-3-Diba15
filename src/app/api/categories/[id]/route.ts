import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import axiosServer from "@/lib/axiosServer";

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const response = await axiosServer.get(`/categories/${id}`);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error fetching category details" }, { status: 500 });
        }
        return NextResponse.json({ error: "Error fetching category details" }, { status: 500 });
    }
}

export async function PUT(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params; 

        const response = await axiosServer.put(`/categories/${id}`, body);
        return NextResponse.json({ success: true, category: response.data });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error updating category" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error updating category" }, { status: 400 });
    }
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await axiosServer.delete(`/categories/${id}`);
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Error deleting category" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error deleting category" }, { status: 400 });
    }
}
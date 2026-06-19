import { NextResponse } from "next/server";
import axiosServer from "@/lib/axiosServer";

export async function GET() {
    try {
        const response = await axiosServer.get(`/users`);
        return NextResponse.json(response.data);
    } catch (error: unknown) {
        console.error("Error inside /api/user Route Handler:", error);
        return NextResponse.error();
    }
}
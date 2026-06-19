import { NextResponse } from "next/server";
import axiosServer from "@/lib/axiosServer";
import axios from "axios";

export async function GET() {
    try {
        const response = await axiosServer.get(`/auth/profile`);

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
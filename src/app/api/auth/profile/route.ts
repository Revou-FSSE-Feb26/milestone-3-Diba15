import { NextResponse } from "next/server";
import axiosServer from "@/lib/axiosServer";
import axios from "axios";

export async function GET() {
    try {
        const response = await axiosServer.get(`/auth/profile`);

        return NextResponse.json(response.data);

    } catch (error: unknown) {

        const err = error as Error;

        console.error("Error di /api/profile Route Handler:", err?.message);

        // Tangkap pesan error manual dari axiosServer
        if (err?.message === "Tidak ada refresh token" || err?.message?.includes("token")) {
            return NextResponse.json(
                { error: "Sesi telah berakhir atau token tidak ditemukan" }, 
                { status: 401 } // Kembalikan ke 401 secara paksa
            );
        }

        if (axios.isAxiosError(err)) {
            return NextResponse.json(
                { error: err.response?.data?.message || "Failed to fetch profile from server" },
                { status: err.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: "Terjadi kesalahan internal" },
            { status: 500 }
        );
    }
}
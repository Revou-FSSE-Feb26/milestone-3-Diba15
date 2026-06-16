import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const user = await request.json();

        if (user.password !== user.confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
        }

        const newUser = {
            name: user.name,
            email: user.email,
            password: user.password,
            avatar: "https://picsum.photos/800"
        };

        const response = await axios.post(`${API_URL}/users`, newUser);
        return NextResponse.json({ success: true, data: response.data });
    } catch (error: unknown) {
        console.error("Error registering user:", error);
        if (axios.isAxiosError(error)) {
            return NextResponse.json({ error: error.response?.data?.message || "Registration failed" }, { status: 500 });
        }
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
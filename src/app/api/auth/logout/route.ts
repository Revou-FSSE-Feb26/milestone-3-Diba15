import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("user_role");
    cookieStore.delete("accessToken");

    return NextResponse.json({ success: true });
}
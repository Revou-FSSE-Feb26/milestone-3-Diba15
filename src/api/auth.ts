"use server";

import axios from "axios";
import bcrypt from "bcryptjs"; // Disarankan menggunakan bcryptjs agar lebih kompatibel dengan Next.js
import { cookies } from "next/headers";
import { RegisterUser, LoginProps, Me } from "@/types/Types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Register User (Server Action)
 */
export const registerUser = async (user: RegisterUser) => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }

    const { password, confirmPassword, name, email } = user;

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }

    try {
        // Hashing password di server (Aman)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: "user" // Default role
        };

        const response = await axios.post(`${API_URL}/users`, newUser);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Error registering user:", error);
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

/**
 * Login User (Server Action)
 */
export const loginUser = async (credentials: LoginProps) => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }

    try {
        const { email, password } = credentials;

        // Ambil data users dari db mock/API
        const response = await axios.get(`${API_URL}/users`);
        const usersData = response.data;

        const matchedUser = usersData.find((u: any) => u.email === email);

        if (!matchedUser) {
            throw new Error("User not found");
        }

        // Verifikasi password (Aman karena di server)
        const matchPassword = await bcrypt.compare(password, matchedUser.password);
        if (!matchPassword) {
            throw new Error("Password does not match");
        }

        // Generate Fake Tokens
        const fakeAccessToken = `access-token-secret-user-${matchedUser.id}`;
        const fakeRefreshToken = `refresh-token-secret-user-${matchedUser.id}`;

        // Set Cookie di Sisi Server menggunakan next/headers
        const cookieStore = await cookies();

        // 1. Refresh Token (HttpOnly & Secure) - Untuk validasi session di middleware
        cookieStore.set("refreshToken", fakeRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            path: "/",
        });

        // 2. User Role Cookie - Untuk pengecekan role di middleware
        cookieStore.set("user_role", matchedUser.role, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        const me: Me & { accessToken: string } = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            accessToken: fakeAccessToken // Dikirim ke client untuk otorisasi Axios
        };

        return { success: true, user: me };
    } catch (error: any) {
        console.error("Error logging in user:", error);
        throw new Error(error.message || "Login failed");
    }
};

/**
 * Logout User (Server Action)
 */
export const logoutUser = async () => {
    const cookieStore = await cookies();

    // Hapus cookies dari server
    cookieStore.delete("refreshToken");
    cookieStore.delete("user_role");

    return { success: true };
};
"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { RegisterUser, LoginProps, Me } from "@/types/Types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Register User (Menggunakan Platzi API)
 */
export const registerUser = async (user: RegisterUser) => {
    if (!API_URL) throw new Error("API_URL is not defined.");

    const { password, confirmPassword, name, email } = user;

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }

    try {
        // Platzi mewajibkan pengiriman 'avatar'. Kita beri default image.
        const newUser = {
            name,
            email,
            password,
            avatar: "https://picsum.photos/800" 
        };

        const response = await axios.post(`${API_URL}/users/`, newUser);
        return { success: true, data: response.data };
    } catch (error: unknown) {
        console.error("Error registering user:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
        throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
};

/**
 * Login User (Mendapatkan JWT dari Platzi API)
 */
export const loginUser = async (credentials: LoginProps) => {
    if (!API_URL) throw new Error("API_URL is not defined.");

    try {
        const { email, password } = credentials;

        // 1. Dapatkan Token JWT dari Platzi
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });

        const { access_token, refresh_token } = loginResponse.data;

        // 2. Gunakan Access Token untuk mendapatkan data profil user
        const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const userData = profileResponse.data;

        // 3. Set Cookie di Sisi Server
        const cookieStore = await cookies();

        cookieStore.set("refreshToken", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
            path: "/",
        });

        cookieStore.set("user_role", userData.role, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        // 4. Return data user berserta access token
        const me: Me & { accessToken: string } = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatar: userData.avatar,
            accessToken: access_token // Dikirim ke client untuk Axios defaults
        };

        return { success: true, user: me };
    } catch (error: unknown) {
        console.error("Error logging in user:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Kredensial tidak valid");
        }
        throw new Error(error instanceof Error ? error.message : "Login failed");
    }
};

/**
 * Logout User
 */
export const logoutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("user_role");
    return { success: true };
};
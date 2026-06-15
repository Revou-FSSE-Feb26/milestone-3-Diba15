"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { RegisterUser, LoginProps, Me } from "@/types/Types";
import { Item } from "@/types/Types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("API_URL is not defined.");
}

// Protected API
export const authApi = axios.create({
    baseURL: API_URL,
});

/**
 * Register User (Menggunakan Platzi API)
 */
export const registerUser = async (user: RegisterUser) => {
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

        const response = await authApi.post(`/users`, newUser);
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
    try {
        const { email, password } = credentials;

        // 1. Dapatkan Token JWT dari Platzi
        const loginResponse = await authApi.post(`/auth/login`, {
            email,
            password
        });

        const { access_token, refresh_token } = loginResponse.data;

        // 2. Gunakan Access Token untuk mendapatkan data profil user
        const profileResponse = await authApi.get(`/auth/profile`, {
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

        cookieStore.set("accessToken", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60,
            path: "/",
        });

        cookieStore.set("user_role", userData.role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return { success: true };
    } catch (error: unknown) {
        console.error("Error logging in user:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Kredensial tidak valid");
        }
        throw new Error(error instanceof Error ? error.message : "Login failed");
    }
};

export const getProfile = async (): Promise<Me> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        throw new Error("Unauthorized");
    }

    const response = await authApi.get(`/auth/profile`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
};

/**
 * Logout User
 */
export const logoutUser = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("user_role");
    cookieStore.delete("accessToken");
    return { success: true };
};


export const getUsers = async () => {
    try {
        const response = await authApi.get(`/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

// POST products

export const postProducts = async (product: Item): Promise<{ success: boolean, product: Item }> => {
    
    try {
        const response = await authApi.post(`/products`, product);
        return {
            success: true,
            product: response.data
        }
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}

export const updateProduct = async (id: number, product: Item): Promise<{ success: boolean, product: Item }> => {
    try {
        const response = await authApi.put(`/products/${id}`, product);
        return {
            success: true,
            product: response.data
        };
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        await authApi.delete(`/products/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

// Post Categories

export const postCategories = async (name: string, image: string) => {
    try {
        const response = await authApi.post(`/categories`, { name, image });
        return {
            success: true,
            categories: response.data
        }
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}
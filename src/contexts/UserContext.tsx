"use client";

import { createContext, useContext, useReducer, ReactNode, useState } from "react";
import { Me, LoginProps, RegisterUser } from "@/types/Types";
import useSWR from "swr";
import axios from "axios";
import { useNotif } from "@/contexts/NotifContext";

// type UserAction =
//     | { type: "LOGIN", payload: LoginProps }
//     | { type: "LOGOUT" }
//     | { type: "REGISTER", payload: RegisterUser }

// interface UserContextType {
//     user: Me | null;
//     login: (data: LoginProps) => Promise<{ success: boolean } | undefined>;
//     logout: () => void;
//     register: (data: RegisterUser) => Promise<{ success: boolean } | undefined>;
//     success: boolean;
// }

// function userReducer(state: UserContextType, action: UserAction): UserContextType {
//     switch (action.type) {
//         case "LOGIN":
//             return { ...state, user: action.payload };
//         case "LOGOUT":
//             return { ...state, user: null };
//         case "REGISTER":
//             return { ...state, user: action.payload };
//         default:
//             return state;
//     }
// }

interface UserContextType {
    user: Me | null;
    success: boolean;
    login: (data: LoginProps) => Promise<{ success: boolean } | undefined>;
    logout: () => void;
    register: (data: RegisterUser) => Promise<{ success: boolean } | undefined>;
}

const UserContext = createContext<UserContextType | null>(null);

// Fetcher for user SWR
const clientFetcher = (url: string) => axios.get(url).then((res) => res.data);

export function UserProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>((() => {
        if (typeof window === "undefined") return false;

        const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
        return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    }));
    const { triggerToast } = useNotif();

    const {
        data: profile,
        mutate: mutateProfile,
    } = useSWR<Me>(
        isLoggedIn ? "/api/auth/profile" : null,
        clientFetcher
    );

    const user = profile ?? { id: 0, name: "", email: "", role: "" };

    const register = async (data: RegisterUser) => {
        try {
            await axios.post("/api/auth/register", data);
            triggerToast("Register Success", "success");
            return { success: true };
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                triggerToast(error.response?.data?.message || "Registration failed", "error");
                throw new Error(error.response?.data?.message || "Registration failed");
            }

            triggerToast(error instanceof Error ? error.message : "Registration failed", "error");
            throw new Error(error instanceof Error ? error.message : "Registration failed");
        }
    }

    /**
     * Login
     * Fungsi login untuk mengautentikasi pengguna.
     * Menggunakan API loginUser, menyimpan data pengguna ke state dan localStorage,
     * serta mengatur header Authorization untuk axios.
     * 
     * @param data LoginProps
     * @returns { success: boolean, message: string }
     */
    const login = async (data: LoginProps) => {
        try {
            const response = await axios.post("/api/auth/login", data);

            if (response.data.success) {
                localStorage.setItem("isLoggedIn", "true");
                setIsLoggedIn(true);

                await mutateProfile();

                triggerToast("Berhasil login!", "success");
                return { success: true, message: "Login success" };
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                triggerToast(error.response?.data?.message || "Login failed", "error");
                return { success: false, message: error.response?.data?.message || "Login failed" };
            }

            triggerToast("Wrong Email & Password!", "error");
            return { success: false, message: "Login failed" };
        }
    }

    /**
     * Logout
     * Fungsi logout untuk menghapus data pengguna dari state dan localStorage,
     * menghapus header Authorization dari axios, dan memanggil logoutUser.
     * 
     * @returns void
     */
    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            await mutateProfile(undefined, false);
            triggerToast("Berhasil logout", "success");
        } catch (error) {
            console.error("Logout Context Error:", error);
        }
    };

    return (
        <UserContext.Provider value={{
            user,
            success: isLoggedIn,
            login, logout, register
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}
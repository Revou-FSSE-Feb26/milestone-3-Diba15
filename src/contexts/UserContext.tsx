"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Me, LoginProps, RegisterUser } from "@/types/Types";
import useSWR from "swr";
import axios from "axios";
import { useNotif } from "@/contexts/NotifContext";

// Default user object - dibuat sekali, bukan di setiap render
const DEFAULT_USER: Me = { id: 0, name: "", email: "", role: "" };

interface UserContextType {
  user: Me | null;
  success: boolean;
  login: (data: LoginProps) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (
    data: RegisterUser,
  ) => Promise<{ success: boolean; message?: string }>;
}

const UserContext = createContext<UserContextType | null>(null);

const clientFetcher = (url: string) => axios.get(url).then((res) => res.data);

export function UserProvider({ children }: { children: ReactNode }) {
  // Hindari hydration mismatch SSR dengan menginisialisasi false di awal
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { triggerToast } = useNotif();

  // Sinkronisasi localStorage setelah komponen di-mount di klien
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      if (storedIsLoggedIn === "true") {
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 0);
      }
    }
  }, []);

  const {
    data: profile,
    mutate: mutateProfile,
    error,
  } = useSWR<Me>(isLoggedIn ? "/api/auth/profile" : null, clientFetcher);

  const user = profile ?? DEFAULT_USER;

  useEffect(() => {
    // Jika SWR mendeteksi error dan itu adalah error 401 (Unauthorized)
    if (error && axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log("Sesi berakhir di latar belakang, membersihkan klien...");

        // 1. Hapus memori palsu dari browser
        localStorage.removeItem("isLoggedIn");
        setTimeout(() => {
          setIsLoggedIn(false);
        }, 0);

        // 2. Beritahu pengguna
        triggerToast(
          "Sesi Anda telah berakhir, silakan login kembali.",
          "warning",
        );
      }
    }
  }, [error, triggerToast]);

  const register = useCallback(
    async (data: RegisterUser) => {
      try {
        await axios.post("/api/auth/register", data);
        triggerToast("Register Success", "success");
        return { success: true, message: "Registration successful" };
      } catch (error: unknown) {
        let errorMessage = "Registration failed";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        triggerToast(errorMessage, "error");
        return { success: false, message: errorMessage };
      }
    },
    [triggerToast],
  );

  /**
   * Login
   * Fungsi login untuk mengautentikasi pengguna.
   * Menggunakan API login, menyimpan status sesi ke state dan localStorage.
   * (Catatan: Header Authorization dikelola via interceptor axios di tempat lain / menggunakan cookies)
   */
  const login = useCallback(
    async (data: LoginProps) => {
      try {
        const response = await axios.post("/api/auth/login", data);

        if (response.data.success) {
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);

          await mutateProfile();

          triggerToast("Berhasil login!", "success");
          return { success: true, message: "Login success" };
        }

        return { success: false, message: "Unsuccessful login attempt" };
      } catch (error: unknown) {
        let errorMessage = "Login failed";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || errorMessage;
        } else {
          errorMessage = "Wrong Email & Password!";
        }

        triggerToast(errorMessage, "error");
        return { success: false, message: errorMessage };
      }
    },
    [triggerToast, mutateProfile],
  );

  /**
   * Logout
   * Fungsi logout untuk menghapus data pengguna dari state, localStorage,
   * dan membersihkan cache SWR.
   */
  const logout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);

      await mutateProfile(undefined, { revalidate: false });

      triggerToast("Berhasil logout", "success");
    } catch (error) {
      console.error("Logout Context Error:", error);
      triggerToast("Gagal memproses logout", "error");
    }
  }, [triggerToast, mutateProfile]);

  const contextValue = useMemo(
    () => ({
      user,
      success: isLoggedIn,
      login,
      logout,
      register,
    }),
    [user, isLoggedIn, login, logout, register],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}

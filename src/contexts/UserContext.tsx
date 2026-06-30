"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Me, LoginProps, RegisterUser } from "@/types/Types";
import useSWR from "swr";
import axios from "axios";
import { useNotif } from "@/contexts/NotifContext";

interface UserContextType {
  user: Me | null;
  login: (data: LoginProps) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (
    data: RegisterUser,
  ) => Promise<{ success: boolean; message?: string }>;
}

const UserContext = createContext<UserContextType | null>(null);

const clientFetcher = (url: string) => axios.get(url).then((res) => res.data);

export function UserProvider({ children }: { children: ReactNode }) {
  const { triggerToast } = useNotif();

  const {
    data: profile,
    mutate: mutateProfile,
    error,
  } = useSWR<Me>("/api/auth/profile", clientFetcher, {
    shouldRetryOnError: false, // untuk mencegah ulang permintaan saat terjadi error
    revalidateOnFocus: false, // untuk mencegah ulang permintaan saat fokus kembali ke tab
  });

  const user = profile ?? null;

  useEffect(() => {
    // Jika SWR mendeteksi error dan itu adalah error 401 (Unauthorized)
    if (error && axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log("Sesi berakhir di latar belakang, membersihkan klien...");

        // Beritahu pengguna
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
      login,
      logout,
      register,
    }),
    [user, login, logout, register],
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

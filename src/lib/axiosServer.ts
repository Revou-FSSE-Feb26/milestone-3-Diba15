import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
}

// Buat instance khusus untuk server-side
const axiosServer = axios.create({
    baseURL: API_URL,
});

// 1. Request Interceptor: Sisipkan Access Token ke setiap request
axiosServer.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Response Interceptor: Tangani 401 dan Refresh Token
axiosServer.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Jika error 401 dan belum pernah di-retry sebelumnya
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const cookieStore = await cookies();
                const refreshToken = cookieStore.get("refreshToken")?.value;

                if (!refreshToken) {
                    throw new Error("Tidak ada refresh token");
                }
                const refreshRes = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken: refreshToken,
                });

                const newAccessToken = refreshRes.data.access_token;
                const newRefreshToken = refreshRes.data.refresh_token || refreshToken;

                const isProd = process.env.NODE_ENV === "production";
                const baseCookieOptions = {
                    httpOnly: true, secure: isProd, sameSite: "strict" as const, path: "/"
                };

                // Perbarui cookie dengan token yang baru
                cookieStore.set("accessToken", newAccessToken, { ...baseCookieOptions, maxAge: 60 * 60 });
                cookieStore.set("refreshToken", newRefreshToken, { ...baseCookieOptions, maxAge: 60 * 60 * 24 * 7 });

                // Ulangi request asli yang tadi gagal dengan token baru
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosServer(originalRequest);

            } catch (refreshError) {
                // Jika refresh token juga gagal/expired, hapus semua sesi
                const cookieStore = await cookies();
                cookieStore.delete("accessToken");
                cookieStore.delete("refreshToken");
                cookieStore.delete("user_role");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosServer;
/**
 * Penanda CartContext sebagai catatan:
 * File ini berfungsi sebagai penyedia konteks untuk keranjang belanja (CartContext) 
 * yang mengelola state dan fungsi-fungsi terkait keranjang belanja.
 *  Fungsi-fungsi yang disediakan oleh CartContext meliputi:
 * - addToCart: Menambahkan item ke dalam keranjang.
 * - removeFromCart: Menghapus item dari keranjang berdasarkan ID item.
 * - decreaseQuantity: Mengurangi jumlah item dalam keranjang berdasarkan ID item.
 * - increaseQuantity: Menambahkan jumlah item dalam keranjang berdasarkan ID item.
 * - clearCart: Mengosongkan keranjang.
 * - triggerToast: Menampilkan pesan toast dengan jenis tertentu (sukses, error, peringatan).
 * - triggerModal: Menampilkan modal dengan pesan dan jenis tertentu (konfirmasi atau peringatan).
 * 
 * CartContext juga menyimpan state keranjang (cart) yang berisi daftar item yang ada di dalam keranjang.
 * 
 * Menggunakan CartContext karena memungkinkan kita untuk mengelola state keranjang belanja secara global di seluruh aplikasi, 
 * sehingga komponen-komponen yang membutuhkan informasi tentang keranjang dapat dengan mudah mengakses dan memodifikasi state 
 * tersebut tanpa harus melakukan prop drilling.
 * 
 * prop drilling adalah proses mengirimkan data dari komponen induk ke komponen anak melalui props, yang bisa menjadi rumit dan 
 * sulit untuk dikelola ketika ada banyak level komponen yang terlibat. Dengan menggunakan konteks, 
 * kita dapat menghindari prop drilling dan membuat kode lebih bersih dan mudah dipelihara.
 * 
 * contoh prop drilling adalah ketika kita memiliki komponen A yang memiliki state tertentu, dan kita ingin menggunakan 
 * state tersebut di komponen C yang merupakan anak dari B, maka kita harus mengirimkan state tersebut dari A ke B melalui 
 * props, dan kemudian dari B ke C melalui props lagi.
 * 
 * Tapi di project ini kita menggunakan CartContext untuk mengelola state keranjang belanja, 
 * sehingga kita tidak perlu melakukan prop drilling untuk mengakses state keranjang di komponen-komponen yang membutuhkannya,
 * kita bisa langsung menggunakan useCart() untuk mengakses state dan fungsi-fungsi yang disediakan 
 * oleh CartContext di mana saja dalam aplikasi selama berada di dalam CartProvider.
 * 
 * Contoh penggunaan jika di project ini ketika kita ingin menambahkan item ke dalam keranjang di komponen lain, kita bisa 
 * langsung menggunakan fungsi addToCart yang disediakan oleh CartContext tanpa harus mengirimkan fungsi tersebut melalui 
 * props dari komponen induk.
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Item, CartItem, CartContextType, Me, LoginProps, RegisterUser } from "@/types/Types";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { loginUser, logoutUser, registerUser } from "@/api/auth";
import axios from "axios";
import { useRouter } from 'next/navigation';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<Me>({ id: 0, name: "", email: "", role: "" });
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning">("success");
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);
    const [modalConfig, setModalConfig] = useState({
        showModal: false,
        modalMsg: '',
        modalType: 'alert' as 'confirmation' | 'alert',
        yesAction: () => { },
        noAction: () => { },
    });
    const router = useRouter();

    // Toast & Modal Function

    const triggerToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setMessage(message);
        setType(type);
        setShowToast(true);

        if (toastTimeout.current) clearTimeout(toastTimeout.current);

        toastTimeout.current = setTimeout(() => {
            setShowToast(false);
            toastTimeout.current = null;
        }, 3000);
    };

    const triggerModal = (msg: string, modalType: 'confirmation' | 'alert', yesAction?: () => void, noAction?: () => void) => {
        setModalConfig({
            showModal: true,
            modalMsg: msg,
            modalType: modalType,
            yesAction: (() => {
                if (yesAction) yesAction();
                clearModal();
            }),
            noAction: (() => {
                if (noAction) noAction();
                clearModal();
            })
        });
    };

    const clearModal = () => {
        setModalConfig((prev) => ({ ...prev, showModal: false }));
    };

    const clearToast = () => {
        setShowToast(false);
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
            toastTimeout.current = null;
        }
    }

    // Initial Cart & User

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        try {
            if (storedCart) {
                setTimeout(() => {
                    setCart(JSON.parse(storedCart));
                }, 0);
            }
        } catch (error) {
            console.log(error);
            localStorage.removeItem("cart");
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else if (cart.length === 0 && localStorage.getItem('cart')) {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    useEffect(() => {
        const fetchUser = () => {
            try {
                const userData = localStorage.getItem("me");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } else {
                    setUser({ id: 0, name: "", email: "", role: "" });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    const register = async (data: RegisterUser) => {
        try {
            await registerUser(data);
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
     * @returns { success: boolean }
     */
    const login = async (data: LoginProps) => {
        try {
            const response = await loginUser(data);

            if (response?.success && response.user) {
                const loggedInUser = response.user;

                setUser({
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    role: loggedInUser.role,
                    avatar: loggedInUser.avatar
                });

                // Pasang JWT access token untuk request selanjutnya
                axios.defaults.headers.common["Authorization"] = `Bearer ${loggedInUser.accessToken}`;

                localStorage.setItem("me", JSON.stringify({
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    role: loggedInUser.role,
                    avatar: loggedInUser.avatar
                }));

                triggerToast("Berhasil login!", "success");
                return { success: true };
            }
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                triggerToast(error.message || "Gagal login", "error");
                throw new Error(error.response?.data?.message || "Gagal login");
            }

            throw new Error(error instanceof Error ? error.message : "Gagal login");
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
            await logoutUser();
            setUser({ id: 0, name: "", email: "", role: "" });
            localStorage.removeItem("me");
            delete axios.defaults.headers.common["Authorization"];
            triggerToast("Berhasil logout", "success");
        } catch (error) {
            console.error("Logout Context Error:", error);
        }
    };

    const getCartWithId = (id: number) => {
        return cart.find(item => item.id === id && item.userId === user.id);
    }

    const getCart = () => {
        return cart.filter(item => item.userId === user.id);
    }

    /**
     * Add To Cart
     * Fungsi untuk menambahkan item ke keranjang belanja.
     * Memeriksa apakah item sudah ada di keranjang atau belum.
     * Jika ada, quantity akan diincrement.
     * Jika tidak ada, item akan ditambahkan ke keranjang.
     * 
     * @param item 
     * @returns void
     */
    const addToCart = (item: Item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.userId === user.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, userId: user.id }];
        });
        triggerToast("Item ditambahkan ke keranjang", "success");
    };

    /**
     * Remove From Cart
     * Fungsi untuk menghapus item dari keranjang belanja.
     * Memeriksa apakah item ada di keranjang atau tidak.
     * Jika ada, item akan dihapus dari keranjang.
     * 
     * @param itemId
     * @returns void
     */
    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId && item.userId === user.id));
    };

    /**
     * Decrease Quantity
     * Fungsi untuk mengurangi jumlah item di keranjang belanja.
     * Memeriksa apakah item ada di keranjang atau tidak.
     * Jika ada, quantity akan dikurangi.
     * 
     * @param itemId
     * @returns void
     */
    const decreaseQuantity = (itemId: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId && item.userId === user.id ? { ...item, quantity: item.quantity - 1 } : item);
        });
    };

    /**
     * Update Quantity
     * Fungsi untuk memperbarui jumlah item di keranjang belanja.
     * Memeriksa apakah item ada di keranjang atau tidak.
     * Jika ada, quantity akan diperbarui.
     * 
     * @param itemId
     * @param quantity
     * @returns void
     */
    const updateQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId && item.userId === user.id ? { ...item, quantity } : item);
        });
    };

    /**
     * Clear Cart
     * Fungsi untuk mengosongkan keranjang belanja.
     * 
     * @returns void
     */
    const clearCart = () => {
        setCart((prevCart) => {
            return prevCart.filter(item => item.userId !== user.id);
        });
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(cart));
        triggerToast("Keranjang berhasil dikosongkan", "success");
    };

    return (
        <CartContext.Provider value={{
            user,
            cart, getCartWithId, getCart, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity,
            triggerToast, clearToast, triggerModal,
            login, logout, register
        }}>
            {showToast && <Toast message={message} type={type} />}
            {modalConfig.showModal && <Modal msg={modalConfig.modalMsg} modalType={modalConfig.modalType} yesAction={modalConfig.yesAction} noAction={modalConfig.noAction} />}
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
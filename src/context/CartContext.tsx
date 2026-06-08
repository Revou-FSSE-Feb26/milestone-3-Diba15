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
import { Item, CartItem, CartContextType, Me, LoginProps } from "@/types/Types";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { loginUser, logoutUser } from "@/api/auth";
import axios from "axios";

// Membuat konteks untuk keranjang belanja (CartContext) dengan tipe CartContextType. 
// Nilai awalnya adalah undefined, yang berarti bahwa konteks ini harus digunakan di dalam CartProvider.
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Berfungsi sebagai penyedia konteks untuk keranjang belanja (CartContext) yang mengelola state dan fungsi-fungsi terkait keranjang belanja.
 * @param ReactNode
 * @returns CartContext.Provider
 */
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
    })

    /** 
     * Berfungsi untuk trigger pesan melalui toast yang akan muncul di layar selama 3 detik. 
     * Pesan ini bisa berupa informasi sukses, error, atau peringatan tergantung pada jenis pesan yang diberikan.
     * @param message
     * @param type
    */
    const triggerToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setMessage(message);
        setType(type);
        setShowToast(true);

        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
        }

        toastTimeout.current = setTimeout(() => {
            setShowToast(false);
            toastTimeout.current = null;
        }, 3000);
    };

    /**
     * Berfungsi untuk trigger modal dengan pesan tertentu dan jenis modal (konfirmasi atau peringatan). Modal ini dapat digunakan 
     * untuk meminta konfirmasi dari pengguna sebelum melakukan tindakan tertentu, seperti menghapus item dari keranjang.
     * @param msg Pesan yang akan ditampilkan di dalam modal.
     * @param modalType Jenis modal, bisa berupa 'confirmation' untuk modal konfirmasi atau 'alert' untuk modal peringatan.
     * @param yesAction Fungsi yang akan dijalankan jika pengguna memilih "Yes" pada modal konfirmasi.
     * @param noAction Fungsi yang akan dijalankan jika pengguna memilih "No" pada modal konfirmasi.
     */
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

    /**
     * Berfungsi untuk menghilangkan pesan toast secara manual sebelum waktu 3 detik habis.
     * @return void
     */
    const clearToast = () => {
        setShowToast(false);
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
            toastTimeout.current = null;
        }
    }

    // Menggunakan useEffect untuk mengambil data keranjang dari localStorage saat komponen pertama kali dimuat.
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        const setTimer = setTimeout(() => {
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        }, 0)

        return () => clearTimeout(setTimer);
    }, []);

    // Menggunakan useEffect untuk menyimpan data keranjang ke localStorage setiap kali state cart berubah.
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else if (cart.length === 0 && localStorage.getItem('cart')) {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    // useEffect untuk Fetch User
    useEffect(() => {
        const fetchUser = () => {
            try {
                const userData = localStorage.getItem("me")

                if (userData) setUser(JSON.parse(userData));
                else setUser({ id: 0, name: "", email: "", role: "" });
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    const login = async (data: LoginProps) => {
        try {
            const response = await loginUser(data);

            if (response.success && response.user) {
                const loggedInUser = response.user;

                // 2. Set user state di client
                setUser({
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    role: loggedInUser.role
                });

                // 3. Pasang token akses ke Axios untuk request client-side berikutnya
                axios.defaults.headers.common["Authorization"] = `Bearer ${loggedInUser.accessToken}`;

                // 4. Simpan info dasar user ke localStorage (tanpa token sensitif agar lebih aman)
                localStorage.setItem("me", JSON.stringify({
                    id: loggedInUser.id,
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    role: loggedInUser.role
                }));

                return { success: true };
            }
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async () => {
        try {
            // 1. Panggil Server Action untuk menghapus cookies di sisi server
            await logoutUser();

            // 2. Bersihkan state user di client
            setUser({ id: 0, name: "", email: "", role: "" });

            // 3. Hapus data dari localStorage browser
            localStorage.removeItem("me");

            // 4. Hapus header otorisasi Axios
            delete axios.defaults.headers.common["Authorization"];
        } catch (error) {
            console.error("Logout Context Error:", error);
        }
    };

    /**
     * Berfungsi untuk menambahkan item ke dalam keranjang. Jika item sudah ada di dalam keranjang, maka fungsi ini akan meningkatkan jumlah (quantity) 
     * item tersebut. Jika item belum ada, maka fungsi ini akan menambahkannya ke dalam keranjang dengan quantity awal 1.
     * @param item Item yang akan ditambahkan ke dalam keranjang.
     * @return void
     */
    const addToCart = (item: Item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    /**
     * Berfungsi untuk menghapus item dari keranjang berdasarkan ID item.
     * @param itemId ID item yang akan dihapus dari keranjang.
     * @return void
     */
    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => {
            return prevCart.filter(item => item.id !== itemId);
        });
    };

    /**
     * Berfungsi untuk mengurangi jumlah item di keranjang, jika quantity lebih dari 1 maka akan dikurangi, 
     * jika tidak maka item akan dihapus dari keranjang
     * @param itemId ID item yang akan dikurangi jumlahnya.
     * @return void
     */
    const decreaseQuantity = (itemId: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item);
        });
    };

    /**
     * Berfungsi untuk mengubah jumlah item di keranjang, jika quantity lebih dari 1 maka akan dikurangi, 
     * jika tidak maka item akan dihapus dari keranjang
     * @param itemId ID item yang akan diubah jumlahnya.
     * @param quantity Jumlah item yang akan diubah.
     * @return void
     */
    const updateQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId ? { ...item, quantity } : item);
        });
    };

    /**
     * Berfungsi untuk mengosongkan keranjang.
     * @return void
     */
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            user,
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            decreaseQuantity,
            triggerToast,
            clearToast,
            triggerModal,
            login,
            logout
        }}>
            {showToast && <Toast message={message} type={type} />}
            {modalConfig.showModal && <Modal msg={modalConfig.modalMsg} modalType={modalConfig.modalType} yesAction={modalConfig.yesAction} noAction={modalConfig.noAction} />}
            {children}
        </CartContext.Provider>
    );
}

/**
 * Berfungsi untuk mengakses konteks keranjang (CartContext) di dalam komponen lain. Fungsi ini memastikan bahwa konteks digunakan di dalam CartProvider,
 * @returns Nilai konteks keranjang yang berisi state dan fungsi-fungsi untuk mengelola keranjang belanja.
 * @throws Error jika fungsi ini digunakan di luar CartProvider.
 */
export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
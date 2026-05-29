"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Item, CartItem, CartContextType } from "@/types/Types";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Berfungsi sebagai penyedia konteks untuk keranjang belanja (CartContext) yang mengelola state dan fungsi-fungsi terkait keranjang belanja.
 * @param ReactNode
 * @returns CartContext.Provider
 */
export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning">("success");
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);
    const [modalConfig, setModalConfig] = useState({
        showModal: false,
        modalMsg: '',
        modalType: 'alert' as 'confirmation' | 'alert',
        yesAction: () => {},
        noAction: () => {},
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

    const triggerModal = (msg: string, modalType: 'confirmation' | 'alert', yesAction?: () => void, noAction?: () => void) => {
        setModalConfig({
            showModal: true,
            modalMsg: msg,
            modalType: modalType,
            yesAction: (() => {
                if(yesAction) yesAction();
                clearModal();
            }),
            noAction: (() => {
                if(noAction) noAction();
                clearModal();
            })
        });
    };

    const clearModal = () => {
        setModalConfig((prev) => ({...prev, showModal: false}));
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
            cart, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity, triggerToast, clearToast, triggerModal
        }}>
            {showToast && <Toast message={message} type={type} />}
            {modalConfig.showModal && <Modal msg={modalConfig.modalMsg} modalType={modalConfig.modalType} yesAction={modalConfig.yesAction} noAction={modalConfig.noAction}/>}
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
"use client";

import {createContext, useContext, useState, useEffect, ReactNode, useRef} from "react";
import {Item, CartItem, CartContextType} from "@/types/Types";
import Toast from "@/components/ui/Toast";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({children}: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning">("success");
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);




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
    }

    const clearToast = () => {
        setShowToast(false);
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
            toastTimeout.current = null;
        }
    }

    // Menggunakan useEffect untuk memuat data keranjang dari localStorage saat komponen pertama kali dimuat.
    // Jika ada data yang disimpan, maka data tersebut akan di-parse dan diset ke state cart.
    // Penggunaan setTimeout dengan delay 0 digunakan untuk memastikan bahwa proses ini terjadi setelah render pertama selesai,
    // sehingga tidak mengganggu performa aplikasi.
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        const setTimer = setTimeout(() => {
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        },0)

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

    // Fungsi untuk menambahkan item ke dalam keranjang. Jika item sudah ada, maka quantity akan ditambah 1.
    // Jika belum ada, maka item baru akan ditambahkan dengan quantity 1.
    const addToCart = (item: Item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? {...cartItem, quantity: cartItem.quantity + 1}
                        : cartItem
                );
            }
            return [...prevCart, {...item, quantity: 1}];
        });
    };

    // Fungsi untuk menghapus item dari keranjang berdasarkan ID item. Fungsi ini akan memfilter item yang
    // ada di dalam keranjang dan hanya menyisakan item yang ID-nya tidak sama dengan ID yang ingin dihapus.
    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => {
            return prevCart.filter(item => item.id !== itemId);
        });
    };

    const decreaseQuantity = (itemId: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId ? {...item, quantity: item.quantity - 1} : item);
        });
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId ? {...item, quantity} : item);
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity, triggerToast, clearToast
        }}>
            {showToast && <Toast message={message} type={type} />}
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
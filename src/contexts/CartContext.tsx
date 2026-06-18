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
import { Item, CartItem, Me, LoginProps, RegisterUser } from "@/types/Types";
import { useNotif } from "@/contexts/NotifContext";
import { useUser } from "./UserContext";


export interface CartContextType {
    cart: CartItem[];
    getCart: () => CartItem[];
    getCartWithId: (id: number) => CartItem | undefined;
    addToCart: (item: Item) => void;
    decreaseQuantity: (itemId: number) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>((() => {
        if (typeof window === "undefined") return [];

        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    }));
    const { triggerToast } = useNotif();
    const { user } = useUser();

    // Initial Cart & User

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else if (cart.length === 0 && localStorage.getItem('cart')) {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    const getCartWithId = (id: number) => {
        return cart.find(item => item.id === id && item.userId === user?.id && item.status === false);
    }

    const getCart = () => {
        return cart.filter(item => item.userId === user?.id && item.status === false);
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
        if (!user) return;

        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.userId === user?.id && cartItem.status === false);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, userId: user?.id, status: false }];
        });
        triggerToast(`${item.title} added to cart`, "success");
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
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId && item.userId === user?.id && item.status === false));
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
        if (!user) return;

        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId && item.userId === user?.id && item.status === false ? { ...item, quantity: item.quantity - 1 } : item);
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
        if (!user) return;

        setCart((prevCart) => {
            return prevCart.map(item => item.id === itemId && item.userId === user?.id && item.status === false ? { ...item, quantity } : item);
        });
    };

    /**
     * Clear Cart
     * Fungsi untuk mengosongkan keranjang belanja.
     * 
     * @returns void
     */
    const clearCart = () => {
        if (!user) return;

        setCart((prevCart) => {
            return prevCart.map(item => item.userId === user?.id && item.status === false ? { ...item, status: true } : item);
        });

        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    return (
        <CartContext.Provider value={{
            cart, getCartWithId, getCart, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
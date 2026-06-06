/**
 * Penanda CartContext sebagai catatan:
 * File ini berfungsi sebagai penyedia konteks untuk keranjang belanja (CartContext) 
 * yang mengelola state dan fungsi-fungsi terkait keranjang belanja.
 *  Fungsi-fungsi yang disediakan oleh CartContext meliputi:
 * - addCart: Menambahkan item ke dalam keranjang.
 * - deleteCart: Menghapus item dari keranjang berdasarkan ID item.
 * - updateCart: Mengupdate jumlah item dalam keranjang berdasarkan ID item.
 * - getCartItems: Mengambil daftar item dalam keranjang.
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
 * langsung menggunakan fungsi addCart yang disediakan oleh CartContext tanpa harus mengirimkan fungsi tersebut melalui 
 * props dari komponen induk.
 */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Item, CartItem, CartContextType } from "@/types/Types";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";
import { addCart, deleteCart, updateCart, clear, getCartItems } from "@/api";

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
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning" | "promise">("success");
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
    const triggerToast = (message: string, type: 'success' | 'error' | 'warning' | 'promise') => {
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

    const fetchCartItems = async () => {
        try {
            const items = await getCartItems();
            setCart(items);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    // Menggunakan useEffect untuk mengambil data keranjang dari localStorage saat komponen pertama kali dimuat.
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        } else {
            fetchCartItems();
        }
    }, []);

    // Menggunakan useEffect untuk menyimpan data keranjang ke localStorage setiap kali state cart berubah.
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        // if (cart.length > 0) {
        //     localStorage.setItem("cart", JSON.stringify(cart));
        // } else if (cart.length === 0 && localStorage.getItem('cart')) {
        //     localStorage.removeItem("cart");
        // }
    }, [cart]);

    /**
     * Berfungsi untuk menambahkan item ke dalam keranjang. Jika item sudah ada di dalam keranjang, maka fungsi ini akan meningkatkan jumlah (quantity) 
     * item tersebut. Jika item belum ada, maka fungsi ini akan menambahkannya ke dalam keranjang dengan quantity awal 1.
     * @param item Item yang akan ditambahkan ke dalam keranjang.
     * @return void
     */
    const addToCart = async (item: Item) => {
        try {
            const existingItem = cart.find(cartItem => cartItem.productId === item.id);
            if (existingItem) {
                updateQuantity(existingItem.id, existingItem.quantity + 1);
            } else {
                triggerToast("Add item to cart", "promise");
                await addCart(item);
                setCart((prevCart) => [...prevCart, { ...item, productId: item.id, quantity: 1 }]);
                triggerToast("Item added to cart", "success");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            triggerToast("Gagal menambahkan item ke keranjang", "error");
        }
    };

    /**
     * Berfungsi untuk menghapus item dari keranjang berdasarkan ID item.
     * @param itemId ID item yang akan dihapus dari keranjang.
     * @return void
     */
    const removeFromCart = async (itemId: number) => {
        try {
            triggerToast("Remove item from cart", "promise");
            await deleteCart(itemId);
            setCart((prevCart) => prevCart.filter(item => item.productId !== itemId));
            triggerToast("Item removed from cart", "success");
        } catch (error) {
            console.error("Error removing item from cart:", error);
            triggerToast("Gagal menghapus item dari keranjang", "error");
        }
    };

    /**
     * Berfungsi untuk mengurangi jumlah item di keranjang, jika quantity lebih dari 1 maka akan dikurangi, 
     * jika tidak maka item akan dihapus dari keranjang
     * @param itemId ID item yang akan dikurangi jumlahnya.
     * @return void
     */
    const decreaseQuantity = async (itemId: number) => {
        try {
            const item = cart.find(item => item.productId === itemId);
            if (item) {
                if (item.quantity > 1) {
                    await updateQuantity(itemId, item.quantity - 1);
                } else {
                    await removeFromCart(itemId);
                    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
                }
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
            triggerToast("Gagal menghapus item dari keranjang", "error");
        }
    };

    /**
     * Berfungsi untuk mengubah jumlah item di keranjang, jika quantity lebih dari 1 maka akan dikurangi, 
     * jika tidak maka item akan dihapus dari keranjang
     * @param itemId ID item yang akan diubah jumlahnya.
     * @param quantity Jumlah item yang akan diubah.
     * @return void
     */
    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            triggerToast("Update the cart", "promise");
            await updateCart(itemId, quantity);
            setCart((prevCart) => {
                return prevCart.map(item => item.productId === itemId ? { ...item, quantity } : item);
            });
            triggerToast(`Successfully update the cart`, "success");
        } catch (error) {
            console.error("Error updating cart item:", error);
            triggerToast("Error updating cart item", "error");
        }
    };

    /**
     * Berfungsi untuk mengosongkan keranjang.
     * @param item Item yang akan dihapus dari keranjang.
     * @return void
     */
    const clearCart = async (item: Item[]) => {
        try {
            triggerToast("Wait for Checkout", "promise");
            await clear(item);
            setCart([]);
            triggerToast("Checkout Succesfull", "success");
        } catch (error) {
            console.error("Error clearing cart:", error);
            triggerToast("Gagal menghapus item dari keranjang", "error");
        }
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity, triggerToast, clearToast, triggerModal
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
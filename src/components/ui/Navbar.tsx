"use client";

import {Montserrat} from "next/font/google";
import Link from "next/link";
import {useCart} from "@/context/CartContext";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export default function Navbar() {
    // Ambil data 'cart' dari context
    const {cart} = useCart();

    // Hitung total jumlah barang di dalam keranjang secara otomatis
    // Menggunakan reduce agar jika user beli 2 iPhone, angka keranjang bertambah 2, bukan 1
    const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="bg-primary text-white p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
                <span className={`text-accent ${montserrat.className}`}>Revo</span>shop
            </Link>
            <div className="flex gap-2 items-center relative">
                {cartTotal > 0 && (
                    <span
                        className="absolute -top-2 -right-2 bg-accent text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-bold animate-fade-in">
                        {cartTotal}
                    </span>
                )}

                {/* Ikon Keranjang Belanja */}
                <Link href="/cart">
                    <i className="fa-solid fa-cart-shopping text-xl cursor-pointer hover:text-accent transition-colors"></i>
                </Link>
            </div>
        </nav>
    );
}
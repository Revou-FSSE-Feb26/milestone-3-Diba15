"use client"

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ActionButton() {
    const { user, getCartQuantity } = useCart();

    const totalItems = getCartQuantity(user.id);

    return (
        <Link href="/cart" className={`${totalItems > 0 ? "flex" : "hidden"} fixed bottom-4 right-4 gap-2 items-center rounded-full bg-accent p-4 text-white transition-colors cursor-pointer`}>
            {totalItems > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-primary text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-bold animate-fade-in">
                    {totalItems}
                </span>
            )}

            {/* Ikon Keranjang Belanja */}
            <i className="fa-solid fa-cart-shopping text-xl cursor-pointer transition-colors"></i>
        </Link>
    );
}
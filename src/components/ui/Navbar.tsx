"use client";

import { useCart } from "@/context/CartContext";
import Brand from "@/components/ui/Brand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {totalCartItems} from "@/utils";

export default function Navbar() {
    // Ambil data 'cart' dari context
    const { cart } = useCart();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const cartTotal = totalCartItems(cart);

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchTerm.trim() !== "") {
            // Arahkan ke halaman pencarian dengan query parameter
            router.push(`/search/${encodeURIComponent(searchTerm)}`);
        }
    }

    return (
        <nav className="text-white p-4 flex justify-between items-center">
            <div className="hidden md:block">
                <Brand />
            </div>

            {/* Search Bar */}
            <form onSubmit={(e) => handleSearch(e)} className="flex items-center justify-between gap-2 w-full max-w-md bg-white rounded-full px-4 py-2 group">
                <input
                    type="text"
                    placeholder="Search products..."
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" w-fit md:w-full rounded-full text-black focus:outline-none transition duration-300"
                />
                <button title="Search" className="text-white bg-accent px-4 py-0.5 rounded-full hover:bg-accent-dark transition-colors cursor-pointer">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>

            <div className="hidden md:flex gap-2 items-center relative">
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
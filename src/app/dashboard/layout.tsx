"use client"

import Link from "next/link";
import React from "react";
import Brand from "@/components/ui/Brand";
import {useCart} from "@/context/CartContext";
import {useRouter} from "next/navigation";
import Footer from "@/components/ui/Footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const {logout} = useCart();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    }

    return (
        <div className="flex flex-1 flex-col h-full">
            <nav className="p-4 flex justify-between items-center bg-primary text-white">
                <Brand />
                <div className="flex gap-2">
                    <Link href="/dashboard/products">Products</Link>
                    <button onClick={() => handleLogout()} className="cursor-pointer">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="flex flex-1 flex-col p-4 justify-center items-center">
                {children}
            </main>

            <Footer />
        </div>
    )
}
"use client";

import Brand from "@/components/ui/Brand";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useCart();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    }

    return (
        <nav className="text-white p-4 flex flex-wrap gap-4 justify-between items-center">
            <div>
                <Brand />
            </div>

            {
                user && user.id === 0 ? (
                    <Link href="/login">
                        <LogIn />
                    </Link>
                ) : (
                    <div className="flex gap-2">
                        {user.role === "admin" && (
                            <Link href="/dashboard">Dashboard</Link>
                        )}
                        <button onClick={() => handleLogout()} className="cursor-pointer">
                            Logout
                        </button>
                    </div>
                )
            }
        </nav>
    );
}
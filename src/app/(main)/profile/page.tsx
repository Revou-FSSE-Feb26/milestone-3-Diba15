"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";

export default function Profile() {
    const { user } = useUser();
    const { getCart } = useCart();

    if (!user) return null;

    const cart = getCart();

    return (
        <>
            <div className="flex flex-col items-center justify-center mt-8 p-8 bg-white rounded-lg shadow-md max-w-2xl w-full mx-auto">
                <Link href="/" className="self-start items-center text-accent hover:text-secondary text-sm inline-flex gap-2 font-medium mb-2 transition-colors">
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>
                <h1 className="text-2xl font-bold mb-4 self-start">Profile</h1>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Image
                            src={user?.avatar || "https://picsum.photos/800"}
                            alt="User Avatar"
                            width={100}
                            height={100}
                            className="w-32 h-32 rounded-full"
                        />
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-lg font-bold">Cart</h2>
                        <p className="text-sm text-gray-500">{cart.length} items</p>
                    </div>
                </div>

                <Link href="/cart" className="items-center text-accent hover:text-secondary text-sm inline-flex gap-2 font-medium mt-4 transition-colors">
                    View Cart
                </Link>
            </div>
        </>
    )
}
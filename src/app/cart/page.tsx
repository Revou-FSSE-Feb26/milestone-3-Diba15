"use client";
import {useCart} from "@/context/CartContext";
import CartCard from "@/components/cart/cartCard";
import Link from "next/link";

export default function CartPage() {
    const {cart, clearCart} = useCart();

    const checkOut = () => {
        alert("Checkout successful! Thank you for your purchase.");
        clearCart();
    }

    return (
        <div className={"flex flex-1 flex-col p-4"}>
            {cart.length === 0 ? (
                <div className={"flex flex-col items-center gap-4 justify-center flex-1"}>
                    <i className="fa-solid fa-cart-shopping text-4xl text-gray-400"></i>
                    <p>Your cart is empty.</p>
                    <Link href="/" className={"bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"}>
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className={"flex flex-col gap-4 max-h-75 overflow-y-auto"}>
                    {cart.map(item => (
                        <CartCard key={item.id} item={item}/>
                    ))}

                    <button onClick={checkOut}
                            className={"bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"}>
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
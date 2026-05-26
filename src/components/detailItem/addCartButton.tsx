"use client";
import {useCart} from "@/context/CartContext";
import {Item} from "@/types/Types";

export default function AddCartButton({item}: {item: Item}) {
    const { addToCart } = useCart();

    return (
        <button onClick={() => addToCart(item)} className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent">
            <i className="fas fa-shopping-cart"></i> Add to Cart
        </button>
    );
}
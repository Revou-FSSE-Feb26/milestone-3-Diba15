"use client";
import { useCart } from "@/context/CartContext";
import { Item } from "@/types/Types";
import CartButton from "@/components/ui/CartButton";

export default function AddCartButton({ item }: { item: Item }) {
    const { cart, addToCart, decreaseQuantity, removeFromCart, triggerToast } = useCart();

    const cartItem = cart.find((cartItem) => cartItem.id === item.id);

    const handleAddToCart = (): void => {
        addToCart(item);
        triggerToast(`${item.name} added to cart`, "success");
    }

    const handleRemoveFromCart = (): void => {
        if (cartItem && cartItem.quantity > 1) {
            decreaseQuantity(item.id);
            triggerToast(`${item.name} quantity decreased`, "warning");
        } else {
            removeFromCart(item.id);
            triggerToast(`${item.name} removed from cart`, "error");
        }
    }

    return (
        <CartButton handleAddToCart={() => handleAddToCart()} handleRemoveFromCart={() => handleRemoveFromCart()} itemCount={cartItem ? cartItem.quantity : 0} />
    );
}
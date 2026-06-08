"use client";
import { useCart } from "@/context/CartContext";
import { Item } from "@/types/Types";
import CartButton from "@/components/cart/CartButton";
import { useRouter } from "next/navigation";

export default function AddCartButton({ item }: { item: Item }) {
    const { user, cart, addToCart, decreaseQuantity, removeFromCart, triggerToast, triggerModal } = useCart();
    const router = useRouter();

    const cartItem = cart.find((cartItem) => cartItem.id === item.id);

    const handleAddToCart = (): void => {
        if (user.id === 0) {
            router.push("/login");
            triggerToast("Login first!", "error");
            return;
        }

        addToCart(item);
    }

    const handleRemoveFromCart = (): void => {
        if (user.id === 0) {
            router.push("/login");
            triggerToast("Login first!", "error");
            return;
        }

        if (cartItem && cartItem.quantity > 1) {
            decreaseQuantity(item.id);
            triggerToast(`${item.name} quantity decreased`, "warning");
        } else {
            triggerModal(
                `Are you sure you want to remove ${item.name} from the cart?`,
                "confirmation",
                () => {
                    removeFromCart(item.id);
                    triggerToast(`${item.name} removed from cart`, "error");
                }
            );
        }
    }

    return (
        <CartButton handleAddToCart={() => handleAddToCart()} handleRemoveFromCart={() => handleRemoveFromCart()} itemCount={cartItem ? cartItem.quantity : 0} />
    );
}

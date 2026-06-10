"use client";
import { useCart } from "@/context/CartContext";
import { Item } from "@/types/Types";
import CartButton from "@/components/cart/CartButton";
import { useRouter } from "next/navigation";

export default function AddCartButton({ item }: { item: Item }) {
    const { user, getCartWithId, getCartQuantityById, addToCart, decreaseQuantity, removeFromCart, triggerToast, triggerModal } = useCart();
    const router = useRouter();
    
    const cartItem = getCartWithId(item.id);
    const quantity = getCartQuantityById(item.id);

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

        if (cartItem && quantity > 1) {
            decreaseQuantity(item.id);
            triggerToast(`${item.title} quantity decreased`, "warning");
        } else {
            triggerModal(
                `Are you sure you want to remove ${item.title} from the cart?`,
                "confirmation",
                () => {
                    removeFromCart(item.id);
                    triggerToast(`${item.title} removed from cart`, "error");
                }
            );
        }
    }

    return (
        <CartButton handleAddToCart={() => handleAddToCart()} handleRemoveFromCart={() => handleRemoveFromCart()} itemCount={quantity ? quantity : 0} />
    );
}

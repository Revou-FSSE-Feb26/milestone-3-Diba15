"use client";
import { useCart } from "@/contexts/CartContext";
import { Item } from "@/types/Types";
import CartButton from "@/components/cart/CartButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useNotif } from "@/contexts/NotifContext";

export default function AddCartButton({ item }: { item: Item }) {
    const { getCartWithId, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const { user } = useUser();
    const { triggerToast, triggerModal } = useNotif();
    const router = useRouter();

    const cartItem = getCartWithId(item.id);
    const quantity = cartItem?.quantity ? cartItem?.quantity : 0;

    const handleAddToCart = (): void => {
        if (user?.id === 0) {
            router.push("/login");
            triggerToast("Login first!", "error");
            return;
        }

        addToCart(item);
    }

    const handleRemoveFromCart = (): void => {
        if (user?.id === 0) {
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
        <CartButton handleAddToCart={() => handleAddToCart()} handleRemoveFromCart={() => handleRemoveFromCart()} itemCount={quantity} />
    );
}

"use client";

import { useCart } from "@/contexts/CartContext";
import { Item } from "@/types/Types";
import CartButton from "@/components/cart/CartButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useNotif } from "@/contexts/NotifContext";
import { useCallback } from "react";

export default function AddCartButton({ item }: { item: Item }) {
    const { activeCart, dispatch } = useCart();
    const { user, success } = useUser();
    const { triggerToast, triggerModal } = useNotif();
    const router = useRouter();

    const cartItem = activeCart.find(c => c.id === item.id);
    const quantity = cartItem?.quantity ?? 0;
    const status = cartItem?.status ?? false;

    const handleAddToCart = useCallback((): void => {
        if (!success || !user) {
            triggerToast("Login first!", "error");
            router.push("/login");
            return;
        }

        dispatch({
            type: "ADD_TO_CART",
            payload: { item, userId: user.id }
        });

        triggerToast(`${item.title} added to cart`, "success");
    }, [success, user, item, dispatch, router, triggerToast]);

    const handleRemoveFromCart = useCallback((): void => {
        if (!success || !user) {
            triggerToast("Login first!", "error");
            router.push("/login");
            return;
        }

        if (cartItem && quantity > 1) {
            dispatch({
                type: "DECREASE_QUANTITY",
                payload: { itemId: item.id, userId: user.id }
            });
            triggerToast(`${item.title} quantity decreased`, "warning");
        } else {
            triggerModal(
                `Are you sure you want to remove ${item.title} from the cart?`,
                "confirmation",
                () => {
                    // 5. Gunakan dispatch untuk menghapus item
                    dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: { itemId: item.id, userId: user.id }
                    });
                    triggerToast(`${item.title} removed from cart`, "error");
                }
            );
        }
    }, [success, user, cartItem, quantity, item, dispatch, triggerModal, router, triggerToast]);

    return (
        <CartButton
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
            itemCount={quantity}
            status={status}
        />
    );
}
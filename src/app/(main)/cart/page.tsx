"use client";

import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useNotif } from "@/contexts/NotifContext";
import { useCallback } from "react";
import Link from "next/link";
import CartCard from "@/components/cart/CartCard";
import { CartItem } from "@/types/Types";
import { cartTotalPrice, totalCartItems } from "@/utils";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
    const { activeCart, dispatch } = useCart();
    const { user } = useUser();
    const { triggerToast, triggerModal } = useNotif();

    const decreaseItem = useCallback((item: CartItem) => {
        if (!user) return;

        if (item.quantity > 1) {
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
                    dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: { itemId: item.id, userId: user.id }
                    });
                    triggerToast(`${item.title} removed from cart`, "error");
                }
            );
        }
    }, [dispatch, user, triggerToast, triggerModal]);

    const handleAddToCart = useCallback((item: CartItem) => {
        if (!user) return;
        dispatch({
            type: "ADD_TO_CART",
            payload: { item, userId: user.id }
        });
        triggerToast(`${item.title} added to cart`, "success");
    }, [dispatch, user]);

    const checkOut = useCallback(() => {
        if (!user) return;

        // Simpan data kalkulasi SAAT INI sebelum keranjang dibersihkan
        const currentTotalItems = totalCartItems(activeCart);
        const currentTotalPrice = cartTotalPrice(activeCart);

        dispatch({ type: "CLEAR_CART", payload: { userId: user.id } });

        triggerModal(
            `Successfull Checkout ${currentTotalItems} items with total price ${currentTotalPrice}`,
            "alert"
        );
    }, [activeCart, dispatch, triggerModal, user]);

    return (
        <div className={"flex flex-1 flex-col p-4"}>
            {activeCart.length === 0 ? (
                <div className={"flex flex-col items-center gap-4 justify-center flex-1"}>
                    <i className="fa-solid fa-cart-shopping text-4xl text-gray-400"></i>
                    <p>Your cart is empty.</p>
                    <Link href="/" className={"bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"}>
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-4 max-h-[70vh] overflow-y-auto"}>
                        {activeCart.map(item => (
                            <CartCard key={item.id} item={item} handleAdd={handleAddToCart} handleDecrease={decreaseItem} />
                        ))}
                    </div>

                    {/* Total Price */}
                    <div className={"flex flex-row items-center justify-between gap-4"}>
                        <p className={"font-bold"}>Total Price:</p>
                        <div className={"flex flex-col"}>
                            <p className={"font-bold"}>{cartTotalPrice(activeCart)}</p>
                            <p className={"text-sm text-gray-500"}>{totalCartItems(activeCart)} items</p>
                        </div>
                    </div>


                    <button onClick={checkOut}
                        className={"bg-primary text-white px-4 py-2 rounded hover:bg-accent cursor-pointer transition-colors duration-300"}>
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
"use client";
import { useCart } from "@/contexts/CartContext";
import CartCard from "@/components/cart/CartCard";
import Link from "next/link";
import { CartItem } from "@/types/Types";
import { cartTotalPrice, totalCartItems } from "@/utils";
import { useNotif } from "@/contexts/NotifContext";

export default function CartPage() {
    const { activeCart, clearCart, addToCart, decreaseQuantity, removeFromCart } = useCart();
    const { triggerToast, triggerModal } = useNotif();

    const cart = activeCart;

    // Fungsi untuk mengurangi jumlah item di keranjang, jika quantity lebih dari 1 maka akan dikurangi, 
    // jika tidak maka item akan dihapus dari keranjang
    const decreaseItem = (item: CartItem) => {
        if (item.quantity > 1) {
            decreaseQuantity(item.id);
            triggerToast(`${item.title} quantity decreased`, "warning");
        } else {
            triggerModal(`Are you sure you want to remove ${item.title} from the cart?`, "confirmation", () => {
                removeFromCart(item.id);
                triggerToast(`${item.title} removed from cart`, "error");
            }, () => { })
        }
    };

    const handleAddToCart = (item: CartItem) => {
        addToCart(item);
    };

    const checkOut = () => {
        clearCart();
        triggerModal(`Successfull Checkout ${totalCartItems(cart)} items with total price ${cartTotalPrice(cart)} `, "alert");
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
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-4 max-h-[70vh] overflow-y-auto"}>
                        {cart.map(item => (
                            <CartCard key={item.id} item={item} handleAdd={handleAddToCart} handleDecrease={decreaseItem} />
                        ))}
                    </div>

                    {/* Total Price */}
                    <div className={"flex flex-row items-center justify-between gap-4"}>
                        <p className={"font-bold"}>Total Price:</p>
                        <div className={"flex flex-col"}>
                            <p className={"font-bold"}>{cartTotalPrice(cart)}</p>
                            <p className={"text-sm text-gray-500"}>{totalCartItems(cart)} items</p>
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
import { Item } from "@/types/Types";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartButton from "@/components/cart/CartButton";

export default function ItemCard({ Item }: { Item: Item }) {
    const { cart, addToCart, decreaseQuantity, removeFromCart, triggerToast, triggerModal } = useCart();

    const cartItem = cart.find((cartItem) => cartItem.id === Item.id);

    const handleAddToCart = (): void => {
        addToCart(Item);
        triggerToast(`${Item.name} added to cart`, "success");
    }

    const handleRemoveFromCart = (): void => {
        if (cartItem && cartItem.quantity > 1) {
            decreaseQuantity(Item.id);
            triggerToast(`${Item.name} quantity decreased`, "warning");
        } else {
            triggerModal(
                `Are you sure you want to remove ${Item.name} from the cart?`,
                "confirmation",
                () => {
                    removeFromCart(Item.id);
                    triggerToast(`${Item.name} removed from cart`, "error");
                }
            );
        }
    }

    const { id, name, price, img_url, category }: Item = Item;

    return (
        <div className={"bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between gap-2"}>
            <Link href={`/product/${id}`} className={"flex flex-col items-center gap-2 w-full justify-between h-full"}>
                <div
                    className={"w-full h-72 border-2 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center group"}>
                    <Image
                        src={img_url}
                        alt={name}
                        width={150}
                        height={150}
                        className={"object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"}
                    />
                </div>
                <div className={"flex flex-row justify-between items-center gap-1 w-full"}>
                    <div className={"flex flex-col gap-1"}>
                        <h2 className={"text-md md:text-lg font-bold"}>{name}</h2>
                        <p className={"text-gray-500"}>{category}</p>
                    </div>
                    <p className={"text-lg md:text-xl font-bold"}>$ {price}</p>
                </div>
            </Link>
            <CartButton handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} itemCount={cartItem ? cartItem.quantity : 0} />
        </div>
    );
}
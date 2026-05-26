import { CartItem } from "@/types/Types";
import Image from "next/image";
import {useCart} from "@/context/CartContext";

export default function CartCard({item}: {item: CartItem}) {
    const {removeFromCart, addToCart, decreaseQuantity} = useCart();

    const decreaseItem = () => {
        if (item.quantity > 1) {
            decreaseQuantity(item.id);
        } else {
            removeFromCart(item.id);
        }
    };

    const {img_url, name, price, quantity} = item

    const itemPrice = typeof price === "number" ? price?.toFixed(2) : "N/A";

    return (
        <div className={"flex items-center gap-4 p-4 border-b"}>
            <Image src={img_url} alt={name} width={64} height={64} className={"object-cover rounded"}/>
            <div className={"flex-1"}>
                <h2>{name}</h2>
                <p>Price: ${itemPrice}</p>
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
                <button onClick={() => decreaseItem()} className={"bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"}>
                    -
                </button>
                <span>{quantity}</span>
                <button onClick={() => addToCart(item)} className={"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"}>
                    +
                </button>
            </div>
        </div>
    );
}
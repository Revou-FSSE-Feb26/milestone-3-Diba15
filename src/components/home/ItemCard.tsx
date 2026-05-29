import {Item} from "@/types/Types";
import Image from "next/image";
import Link from "next/link";
import {useCart} from "@/context/CartContext";

export default function ItemCard({Item}: { Item: Item }) {
    const {addToCart, triggerToast} = useCart();

    const handleAddToCart = (): void => {
        addToCart(Item);
        triggerToast(`${Item.name} added to cart`, "success");
    }

    const {id, name, price, img_url, category}: Item = Item;

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
                        <h2 className={"text-lg font-bold"}>{name}</h2>
                        <p className={"text-gray-500"}>{category}</p>
                    </div>
                    <p className={"text-xl font-bold"}>$ {price}</p>
                </div>
            </Link>
            <button onClick={() => handleAddToCart()}
                    className={"bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent w-full"}><i
                className={"fas fa-shopping-cart"}></i> Add to Cart
            </button>
        </div>
    );
}
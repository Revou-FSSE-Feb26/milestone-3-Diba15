import { CartItem } from "@/types/Types";
import Image from "next/image";

export default function CartCard({ item, handleAdd, handleDecrease }: { item: CartItem, handleAdd: (item: CartItem) => void, handleDecrease: (item: CartItem) => void }) {
    const { images, title, price, quantity } = item

    const itemPrice = typeof price === "number" ? price?.toFixed(2) : "N/A";

    return (
        <div className={"flex items-center gap-4 p-4 border-b border-gray-200"}>
            <Image src={images[0]} alt={title} width={64} height={64} className={"object-cover rounded"} />
            <div className={"flex-1"}>
                <h2 className="font-extrabold tracking-tight">{title}</h2>
                <p className="text-sm text-gray-500">Price: ${itemPrice}</p>
            </div>
            <div className={"flex flex-row gap-2 items-center"}>
                <button onClick={() => handleDecrease(item)} className={"bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"}>
                    -
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleAdd(item)} className={"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"}>
                    +
                </button>
            </div>
        </div>
    );
}

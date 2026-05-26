import {Item} from "@/types/Types";
import Image from "next/image";
import Link from "next/link";
import {useCart} from "@/context/CartContext";

export default function ItemCard({Item}: { Item: Item }) {
    const {addToCart} = useCart();

    const {id, name, price, img_url, category} = Item;

    return (
        <div className={"bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between gap-2"}>
            <Link href={`/product/${id}`} className={"flex flex-col items-center gap-2 w-full"}>
                <Image src={img_url} alt={name} width={150} height={150}
                       className={"object-cover border-2 border-gray-200 rounded"}/>
                <div className={"flex flex-col items-center gap-1"}>
                    <h2>{name}</h2>
                    <p>$ {price}</p>
                    <p>{category}</p>
                </div>
            </Link>
            <button onClick={() => addToCart(Item)}
                    className={"bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-accent"}><i
                className={"fas fa-shopping-cart"}></i> Add to Cart
            </button>
        </div>
    );
}
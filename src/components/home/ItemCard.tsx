"use client";

import { Item } from "@/types/Types";
import Image from "next/image";
import Link from "next/link";
import AddCartButton from "@/components/detailItem/AddCartButton";
import { priceFormatter } from "@/utils";

export default function ItemCard({ item }: { item: Item }) {
    const { id, name, price, img_url, category }: Item = item;

    return (
        <div className={"bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between gap-2"}>
            <Link href={`/product/${id}`} className={"flex flex-col items-center gap-2 w-full justify-between h-full"}>
                <div
                    className={"w-full h-72 border-2 p-4 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center group"}>
                    <Image
                        src={img_url}
                        alt={name}
                        width={150}
                        height={150}
                        className={"object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-200"}
                    />
                </div>
                <div className={"flex flex-col md:flex-row justify-between items-center gap-1 w-full"}>
                    <div className={"flex flex-col gap-1"}>
                        <h2 className={"text-md md:text-lg font-bold"}>{name}</h2>
                        <p className={"text-gray-500"}>{category}</p>
                    </div>
                    <p className={"text-lg md:text-xl font-bold"}>{priceFormatter(Number(price))}</p>
                </div>
            </Link>
            <AddCartButton item={item} />
        </div>
    );
}
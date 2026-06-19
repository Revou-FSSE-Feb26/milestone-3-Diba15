"use client";

import { Item } from "@/types/Types";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import AddCartButton from "@/components/detailItem/AddCartButton";
import { priceFormatter } from "@/utils";
import CategoryPill from "@/components/ui/CategoryPill";

function ItemCard({ item }: { item: Item }) {
    const { id, title, price, images, category }: Item = item;

    return (
        <div className={"bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between gap-2"}>
            <Link href={`/product/${id}`} prefetch={false} className={"flex flex-col items-center gap-2 w-full justify-between h-full"}>
                <div
                    className={"w-full h-72 border-2 p-4 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center group"}>
                    <Image
                        src={images[0]}
                        alt={title}
                        width={150}
                        height={150}
                        className={"object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-200"}
                    />
                </div>
                <div className={"flex flex-col md:flex-row justify-between items-center gap-1 w-full"}>
                    <div className={"flex flex-col gap-1"}>
                        <h2 className={"font-extrabold tracking-tight"}>{title}</h2>
                        <CategoryPill category={category.name} />
                    </div>
                    <p className={"text-lg md:text-xl font-bold"}>{priceFormatter(Number(price))}</p>
                </div>
            </Link>
            <AddCartButton item={item} />
        </div>
    );
}

export default memo(ItemCard, (prevProps, nextProps) => {
    // Return true jika props sama (jangan re-render), false jika props berbeda (re-render)
    return prevProps.item.id === nextProps.item.id;
});
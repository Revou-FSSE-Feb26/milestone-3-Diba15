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

    // Proteksi URL Gambar (Mencegah aplikasi crash jika Platzi API mengirim format string aneh)
    const safeImageUrl = images && images.length > 0 && images[0].startsWith('http')
        ? images[0].replace(/[\[\]"]/g, '') 
        : "https://picsum.photos/800";

    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between gap-2">
            <Link href={`/product/${id}`} prefetch={false} className="flex flex-col items-center gap-2 w-full justify-between h-full">
                <div className="w-full h-72 border-2 p-4 border-gray-200 rounded-lg overflow-hidden flex items-center justify-center group">
                    <Image
                        src={safeImageUrl}
                        alt={title}
                        width={150}
                        height={150}
                        className="object-cover w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = '<i class="fa-solid fa-image text-gray-400 text-4xl"></i>';
                            }
                        }}
                        />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-1 w-full mt-2">
                    <div className="flex flex-col gap-1 text-left w-full">
                        <h2 className="font-extrabold tracking-tight truncate max-w-37.5">{title}</h2>
                        <div className="self-start">
                            <CategoryPill category={category?.name || "General"} />
                        </div>
                    </div>
                    <p className="text-lg md:text-xl font-bold whitespace-nowrap text-right">
                        {priceFormatter(Number(price))}
                    </p>
                </div>
            </Link>
            
            {/* Lebar penuh agar tombol rapi */}
            <div className="w-full mt-2">
                <AddCartButton item={item} />
            </div>
        </div>
    );
}

export default memo(ItemCard);
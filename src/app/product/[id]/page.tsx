"use client";

import Image from "next/image";
import AddCartButton from "@/components/detailItem/AddCartButton";
import { Item } from "@/types/Types";
import ActionButton from "@/components/home/ActionButton";
import { useState, useEffect } from "react";
import { getProductById } from "@/api";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const [itemsData, setItemsData] = useState<Item[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {

            // Await params-nya karena params adalah sebuah Promise
            const resolvedParams = await params;

            // Konversi id dari string URL menjadi number agar cocok dengan ID di JSON
            const id: number = Number(resolvedParams.id);

            try {
                const product = await getProductById(id);
                setItemsData([product]);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [params]);

    // Berikan validasi jika produk tidak ditemukan
    if (!itemsData[0]) {
        return <div className="p-10 text-center">Produk tidak ditemukan!</div>;
    }

    const item = itemsData[0];

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 self-start">Product Detail</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <Image src={item.img_url} alt={item.name} width={300} height={300} className="object-cover w-auto h-auto rounded-lg" />
                <div className={"flex flex-col gap-2 max-w-md justify-center"}>
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <AddCartButton item={item} />
                </div>
            </div>

            <ActionButton />
        </div>
    );
}
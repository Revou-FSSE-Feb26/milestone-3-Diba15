"use client";

import Image from "next/image";
import AddCartButton from "@/components/detailItem/AddCartButton";
import { Item } from "@/types/Types";
import ActionButton from "@/components/home/ActionButton";
import { useState, useEffect } from "react";
import { getProductById } from "@/api";
import Loading from "@/components/ui/Loading";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const [itemsData, setItemsData] = useState<Item>({
        id: 0,
        title: "",
        description: "",
        price: 0,
        images: [],
        category: { id: 0, name: "", image: "" },
        stock: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            // Await params-nya karena params adalah sebuah Promise
            const resolvedParams = await params;

            // Konversi id dari string URL menjadi number agar cocok dengan ID di JSON
            const id: number = Number(resolvedParams.id);

            try {
                setLoading(true);
                const product = await getProductById(id);
                setItemsData(product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params]);

    
    const productImage = itemsData.images && itemsData.images.length > 0
        ? itemsData.images[0]
        : "https://picsum.photos/800";

    return (
        <>
            {itemsData && !loading && (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4 self-start">Product Detail</h1>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="relative w-75 h-75 shrink-0">
                            <Image
                                src={productImage}
                                alt={itemsData.title}
                                width={300}
                                height={300}
                                className="object-cover rounded-lg w-full h-full"
                                priority
                            />
                        </div>
                        <div className="flex flex-col gap-3 max-w-md justify-center">
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-1 rounded self-start">
                                {itemsData.category.name}
                            </span>
                            <h2 className="text-xl font-bold text-gray-800">{itemsData.title}</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">{itemsData.description}</p>
                            <p className="text-lg font-extrabold text-gray-900">Price: ${itemsData.price}</p>

                            {/* Pastikan AddCartButton di dalamnya sudah menyesuaikan dengan tipe data baru */}
                            <AddCartButton item={itemsData} />
                        </div>
                    </div>
                </div>
            )}

            {loading && <Loading status={loading} />}

            {!itemsData && !loading && (
                <div className="text-center text-gray-500 py-10">
                    No product details found.
                </div>
            )}

            <ActionButton />
        </>
    );
}
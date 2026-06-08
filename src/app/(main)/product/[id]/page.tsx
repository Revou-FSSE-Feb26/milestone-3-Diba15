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
        name: "",
        description: "",
        price: 0,
        img_url: "",
        category: "",
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

    return (
        <>
            {itemsData && !loading && (
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4 self-start">Product Detail</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Image src={itemsData.img_url} alt={itemsData.name} width={300} height={300} className="object-cover w-auto h-auto rounded-lg" />
                        <div className={"flex flex-col gap-2 max-w-md justify-center"}>
                            <h2 className="text-xl font-bold">{itemsData.name}</h2>
                            <p>{itemsData.description}</p>
                            <p>Price: ${itemsData.price}</p>
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
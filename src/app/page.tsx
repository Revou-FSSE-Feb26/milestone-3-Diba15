"use client";

import { categories, Item } from "@/types/Types";
import ItemCard from "@/components/home/ItemCard";
import ActionButton from "@/components/home/ActionButton";
import Link from "next/link";
import {getProducts} from "@/api";
import { useEffect, useState } from "react";

export default function Home() {
    const [itemsData, setItemsData] = useState<Item[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProducts();
                setItemsData(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="p-4">
            <div className="flex gap-2  transition-all cursor-pointer duration-300 w-full overflow-x-auto">
                {
                    categories.map((category) => (
                        <Link key={category} href={{ pathname: '/search', query: { category: encodeURIComponent(category) } }} className="hover:text-accent px-4 py-2 bg-accent/10 rounded-lg">
                            <h2>{category}</h2>
                        </Link>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {itemsData.map((item) => (
                    <ItemCard key={item.id} Item={item} />
                ))}
            </div>

            {/* Validasi jika produk di kategori tersebut kosong */}
            {itemsData.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No products found in this category.
                </div>
            )}

            <ActionButton />
        </div>
    );
}

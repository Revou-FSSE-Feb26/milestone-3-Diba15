"use client"

import { categories, Item } from "@/types/Types";
import ItemCard from "@/components/home/ItemCard";
import items from "@/data/items.json";
import { useEffect, useState } from "react";
import { filterItemsByCategory } from "@/utils";
import ActionButton from "@/components/home/ActionButton";
import {useRouter} from "next/navigation";

const itemsData: Item[] = items.items;

export default function Home() {
    // const [selectedCategory] = useState<string>("All");

    const [filteredItems] = useState<Item[]>(itemsData);

    const router = useRouter();

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         const filtered = filterItemsByCategory(itemsData, selectedCategory);
    //         setFilteredItems(filtered);
    //     }, 0);
    //     return () => clearTimeout(timer);
    // }, [selectedCategory]);

    const handleSearch = (searchTerm: string) => {
        router.push(`/search/${encodeURIComponent(searchTerm)}`);
    }

    return (
        <div className="p-4">
            <div className="flex gap-2  transition-all cursor-pointer duration-300 w-full overflow-x-auto">
                {
                    categories.map((category) => (
                        <div key={category} className="hover:text-accent px-4 py-2 bg-accent/10 rounded-lg" onClick={() => handleSearch(category)}>
                            <h2>{category}</h2>
                        </div>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filteredItems.map((item) => (
                    <ItemCard key={item.id} Item={item} />
                ))}
            </div>

            {/* Validasi jika produk di kategori tersebut kosong */}
            {filteredItems.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No products found in this category.
                </div>
            )}

            <ActionButton />
        </div>
    );
}

"use client"

import {categories, Item} from "@/types/Types";
import ItemCard from "@/components/home/ItemCard";
import items from "@/data/items.json";
import {useEffect, useState} from "react";

const itemsData: Item[] = items.items;

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const [filteredItems, setFilteredItems] = useState<Item[]>(itemsData);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (selectedCategory === "All") {
                setFilteredItems(itemsData);
            } else {
                const filtered = itemsData.filter(
                    (item) => item.category === selectedCategory
                );
                setFilteredItems(filtered);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [selectedCategory]);

    return (
        <div className="p-4">
            <div className="flex gap-2  transition-all cursor-pointer duration-300 w-full overflow-x-auto">
                {
                    categories.map((category) => (
                        <div key={category} className="hover:text-accent px-4 py-2 bg-accent/10 rounded-lg" onClick={() => setSelectedCategory(category)}>
                            <h2>{category}</h2>
                        </div>
                    ))
                }
            </div>

            {/* Item Cards - Menggunakan data 'filteredItems' yang dinamis */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {filteredItems.map((item) => (
                    <ItemCard key={item.id} Item={item}/> // Gunakan item.id sebagai key agar lebih aman dari item.name
                ))}
            </div>

            {/* Validasi jika produk di kategori tersebut kosong */}
            {filteredItems.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No products found in this category.
                </div>
            )}
        </div>
    );
}

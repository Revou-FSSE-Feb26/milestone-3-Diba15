"use client";

import { Item } from "@/types/Types";
import items from "@/data/items.json";
import { useParams } from "next/navigation";
import ItemCard from "@/components/home/ItemCard";
import { useSearch } from "@/hooks";
import ActionButton from "@/components/home/ActionButton";

const itemsData: Item[] = items.items;

export default function SearchPage() {
    const params = useParams();
    // Jika slug adalah array, ambil elemen pertama, jika tidak, gunakan langsung. decodeURIComponent agar karakter khusus bisa dicari.
    const slug = Array.isArray(params.slug) ? decodeURIComponent(params.slug[0]) : decodeURIComponent(params.slug || "");
    const searchResults = useSearch(slug, itemsData);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results for: {slug}</h1>
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map((item) => (
                        <ItemCard key={item.id} Item={item} />
                    ))}
                </div>
            ) : (
                <p>No products found for &quot;{slug}&quot;.</p>
            )}

            <ActionButton />
        </div>
    );
}
"use client";

import { useSearchParams } from "next/navigation";
import ItemCard from "@/components/home/ItemCard";
import { useSearch } from "@/hooks";

export default function SearchResults() {
    const params = useSearchParams();
    // Jika searchTerm adalah array, ambil elemen pertama, jika tidak, gunakan langsung. decodeURIComponent agar karakter khusus bisa dicari.
    const searchTerm = decodeURIComponent(params.get("name") || "");
    const searchTermWithCategory = decodeURIComponent(params.get("category") || "");
    
    const searchResults = useSearch(searchTerm, searchTermWithCategory);

    return (
        <div>
            {searchResults.length > 0 ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Search Results for: {searchTerm || searchTermWithCategory}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.map((item) => (
                            <ItemCard key={item.id} Item={item} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center mt-8">
                    <h1 className="text-2xl font-bold mb-4">Search Results for: {searchTerm || searchTermWithCategory}</h1>
                    <p>No products found for &quot;{searchTerm || searchTermWithCategory}&quot;.</p>
                </div>
            )}
        </div>
    )
}
"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types/Types";

/**
 * Custom hook for searching items based on a searchTerm.
 *
 * @param searchTerm The search term (decoded).
 * @param allItems The array of all items to search through.
 * @returns An array of filtered items matching the search term.
 */
export function useSearch(searchTerm: string, allItems: Item[]): Item[] {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    useEffect(() => {
        // Jika searchTerm kosong, kembalikan array kosong
        if (!normalizedSearchTerm) {
            setTimeout(() => {
                setSearchResults([]);
            }, 0);
            return;
        }

        if (normalizedSearchTerm === "all") {
            setTimeout(() => {
                setSearchResults(allItems);
            }, 0);
            return;
        }

        // Lakukan pemfilteran item
        const filteredwithTitle = allItems.filter(
            (item) => item.name.toLowerCase().includes(normalizedSearchTerm)
        );

        const filteredWithCategories = allItems.filter(
            (item) => item.category.toLowerCase().includes(normalizedSearchTerm)
        );

        // Normalize the results to avoid duplicates
        const normalizeResults = () => {
            const uniqueResults = new Set([...filteredwithTitle, ...filteredWithCategories]);
            setSearchResults(Array.from(uniqueResults));
        }

        normalizeResults();
    }, [normalizedSearchTerm, allItems]); // Dependensi: searchTerm dan allItems

    return searchResults;
}


"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types/Types";
import { searchProducts, getProductsByCategory, getProducts } from "@/api";

/**
 * Custom hook for searching items based on a searchTerm.
 *
 * @param searchTerm The search term (decoded).
 * @param searchTermWithCategory The category to filter by.
 * @param allItems The array of all items to search through.
 * @returns An array of filtered items matching the search term.
 */
export function useSearch(searchTerm: string, searchTermWithCategory: string): Item[] {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const normalizedSearchTermWithCategory = searchTermWithCategory.trim().toLowerCase();


    useEffect(() => {
        const fetchSearchResults = async () => {

            if (normalizedSearchTerm) {
                try {
                    const results = await searchProducts(normalizedSearchTerm);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error searching products:", error);
                    setSearchResults([]);
                }
            } else if (normalizedSearchTermWithCategory) {
                try {
                    if (normalizedSearchTermWithCategory === "all") {
                        const allItemsResponse = await getProducts();
                        setSearchResults(allItemsResponse);
                        return;
                    }

                    const results = await getProductsByCategory(normalizedSearchTermWithCategory);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error fetching products by category:", error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
                return;
            }
        };

        fetchSearchResults();
    }, [normalizedSearchTerm, normalizedSearchTermWithCategory]); // Dependensi: searchTerm, searchTermWithCategory


    return searchResults;
}


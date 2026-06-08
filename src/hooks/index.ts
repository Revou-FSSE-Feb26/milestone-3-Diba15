"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types/Types";
import { searchProducts, getProductsByCategory, getProducts } from "@/api";

/**
 * Custom hook for searching items based on a searchTerm and category.
 *
 * @param searchTerm The search term (decoded).
 * @param searchTermWithCategory The category to filter by.
 * @returns An array of filtered items matching the search term and category.
 */
export function useSearch(searchTerm: string, searchTermWithCategory: string): Item[] {
    const [searchResults, setSearchResults] = useState<Item[]>([]);
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const normalizedSearchTermWithCategory = searchTermWithCategory.trim().toLowerCase();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                if (normalizedSearchTerm && normalizedSearchTermWithCategory && normalizedSearchTermWithCategory !== "all") {
                    const results = await getProductsByCategory(normalizedSearchTermWithCategory);
                    const filteredByName = results.filter((item) =>
                        item.name.toLowerCase().includes(normalizedSearchTerm)
                    );
                    setSearchResults(filteredByName);
                    return;
                }

                if (normalizedSearchTerm) {
                    const results = await searchProducts(normalizedSearchTerm);
                    setSearchResults(results);
                    return;
                }

                if (normalizedSearchTermWithCategory) {
                    if (normalizedSearchTermWithCategory === "all") {
                        const allItemsResponse = await getProducts();
                        setSearchResults(allItemsResponse);
                        return;
                    }

                    const results = await getProductsByCategory(normalizedSearchTermWithCategory);
                    setSearchResults(results);
                    return;
                }

                const allItemsResponse = await getProducts();
                setSearchResults(allItemsResponse);
            } catch (error) {
                console.error("Error fetching search products:", error);
                setSearchResults([]);
            }
        };

        fetchSearchResults();
    }, [normalizedSearchTerm, normalizedSearchTermWithCategory]);

    return searchResults;
}


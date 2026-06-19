"use client";

import ItemCard from "@/components/home/ItemCard";
import Loading from "@/components/ui/Loading";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { Item, PlatziCategory } from "@/types/Types";
import { useMemo, useState, useEffect } from "react";

const clientFetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductList() {
    const LIMIT_PER_PAGE = 8;
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: categories } = useSWR<PlatziCategory[]>("api/categories", clientFetcher);

    const selectedCategoryId = useMemo(() => {
        if (selectedCategory === "All") return undefined;
        return categories?.find(c => c.name === selectedCategory)?.id;
    }, [selectedCategory, categories]);

    const getKey = (pageIndex: number, previousPageData: Item[] | null) => {
        if (previousPageData && previousPageData.length < LIMIT_PER_PAGE) return null;

        const searchParams = new URLSearchParams();
        searchParams.append("offset", (pageIndex * LIMIT_PER_PAGE).toString());
        searchParams.append("limit", LIMIT_PER_PAGE.toString());

        if (debouncedSearchTerm.trim()) searchParams.append("title", debouncedSearchTerm.trim());
        if (selectedCategoryId) searchParams.append("categoryId", selectedCategoryId.toString());

        return `/api/products?${searchParams.toString()}`;
    };

    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useSWRInfinite<Item[]>(
        getKey,
        clientFetcher,
        {
            revalidateFirstPage: false // Mencegah re-fetch halaman 1 saat kembali ke tab browser, hemat beban server
        }
    );

    useEffect(() => {
        setSize(1);
    }, [debouncedSearchTerm, selectedCategory, setSize]);

    const itemsData = useMemo(() => {
        return data ? data.flat() : [];
    }, [data]);
    
    const lastPage = data?.[data.length - 1];
    const hasMore = !lastPage || lastPage.length === LIMIT_PER_PAGE;
    const loadingMore = isValidating && size > 1;

    const handleLoadMore = () => {
        if (loadingMore || !hasMore) return;
        setSize(size + 1);
    };

    const dynamicCategories = useMemo(() => {
        // Fallback array kosong jika categories undefined agar aman
        const uniqueCats = new Set((categories || []).map(category => category.name));
        return ["All", ...Array.from(uniqueCats)];
    }, [categories]);

    return (
        <div>
            <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px] items-end">
                <div>
                    <label htmlFor="home-search-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Name
                    </label>
                    <input
                        id="home-search-name"
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search product name..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>

                <div>
                    <label htmlFor="home-search-category" className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Category
                    </label>
                    <select
                        id="home-search-category"
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    >
                        {dynamicCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="py-10">
                    <Loading status={isLoading} />
                </div>
            ) : (
                <>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {itemsData.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Empty State */}
                    {itemsData.length === 0 && (
                        <div className="text-center text-gray-500 py-10">
                            No products found for the selected search and category.
                        </div>
                    )}

                    {/* LOAD MORE BUTTON */}
                    {hasMore && itemsData.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-accent/90 disabled:bg-gray-400"
                            >
                                {loadingMore ? "Loading more..." : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
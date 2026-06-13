"use client";

import ItemCard from "@/components/home/ItemCard";
import Loading from "@/components/ui/Loading";
import useSWRInfinite from "swr/infinite";
import { Item } from "@/types/Types";
import { useMemo, useState } from "react";
import { getProductsWithPagination } from "@/api/index";

export default function ProductList() {
    const LIMIT_PER_PAGE = 8;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Fungsi untuk mengambil data/key halaman berikutnya, 
    // dan memeriksa apakah halaman sebelumnya memiliki data yang cukup
    const getKey = (pageIndex: number, previousPageData: Item[] | null) => {
        if (previousPageData && previousPageData.length < LIMIT_PER_PAGE) return null;

        return {
            offset: pageIndex * LIMIT_PER_PAGE,
            limit: LIMIT_PER_PAGE,
        };
    };

    // Fungsi untuk mengambil data halaman berikutnya melalui SWR Infinite
    const {
        data,
        size,
        setSize,
        isLoading,
        isValidating,
    } = useSWRInfinite(
        getKey,
        ({ offset, limit }) => getProductsWithPagination(offset, limit)
    );

    // State tambahan untuk Load More
    const itemsData = useMemo(() => {
        return data ? data.flat() : [];
    }, [data]);
    const lastPage = data?.[data.length - 1];
    const hasMore = !lastPage || lastPage.length === LIMIT_PER_PAGE;
    const loadingMore = isValidating && size > 1;

    // Fungsi untuk memuat data halaman berikutnya
    const handleLoadMore = () => {
        if (loadingMore || !hasMore) return;
        setSize(size + 1);
    };

    // Membuat daftar kategori secara dinamis
    const dynamicCategories = useMemo(() => {
        const uniqueCats = new Set(itemsData.map(item => item.category.name));
        return ["All", ...Array.from(uniqueCats)];
    }, [itemsData]);

    // Fungsi untuk memfilter data berdasarkan kategori dan pencarian
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    // Menggunakan useMemo untuk membatasi pemanggilan fungsi filter
    // jika nilai input tidak berubah dari pemanggilan sebelumnya
    // dengan menggunakan useMemo ini, fungsi filter hanya akan dipanggil ketika nilai input berubah
    const filteredItems = useMemo(
        () =>
            itemsData.filter((item) => {
                const matchesCategory =
                    selectedCategory === "All" ||
                    item.category.name.toLowerCase() === selectedCategory.toLowerCase();

                const matchesName =
                    normalizedSearchTerm === "" ||
                    item.title.toLowerCase().includes(normalizedSearchTerm);

                return matchesCategory && matchesName;
            }),
        [itemsData, normalizedSearchTerm, selectedCategory]
    );

    return (
        <div>
            {
                isLoading ? (
                    <Loading status={isLoading} />
                ) : (
                    <div>
                        {/* Filter & Search Bar */}
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

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {filteredItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredItems.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                No products found for the selected search and category.
                            </div>
                        )}

                        {/* LOAD MORE BUTTON */}
                        {hasMore && filteredItems.length > 0 && (
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
                    </div>
                )
            }
        </div>
    );
}

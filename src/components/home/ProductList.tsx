"use client";

import ItemCard from "@/components/home/ItemCard";
import Loading from "@/components/ui/Loading";
import { Item } from "@/types/Types";
import { useMemo, useState, useEffect } from "react";
import { getProductsWithPagination } from "@/api/index";

export default function ProductList() {
    const LIMIT_PER_PAGE = 8;

    const [itemsData, setItemsData] = useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    
    // State tambahan untuk Load More
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Fetch data pertama kali (Page 1)
    useEffect(() => {
        const getInitialProducts = async () => {
            try {
                setLoading(true);
                const products = await getProductsWithPagination(0, LIMIT_PER_PAGE);
                
                setItemsData(products);
                setOffset(products.length);
                
                // Jika produk yang kembali kurang dari LIMIT, berarti data di backend sudah habis
                if (products.length < LIMIT_PER_PAGE) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        getInitialProducts();
    }, []);

    // Fungsi untuk memuat data halaman berikutnya
    const handleLoadMore = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const newProducts = await getProductsWithPagination(offset, LIMIT_PER_PAGE);

            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                // Menggabungkan produk lama dengan produk yang baru di-fetch
                setItemsData((prevItems) => [...prevItems, ...newProducts]);
                setOffset((prevOffset) => prevOffset + newProducts.length);
                // Jika data yang didapat kurang dari LIMIT, tandanya sudah halaman terakhir
                if (newProducts.length < LIMIT_PER_PAGE) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Membuat daftar kategori secara dinamis
    const dynamicCategories = useMemo(() => {
        const uniqueCats = new Set(itemsData.map(item => item.category.name));
        return ["All", ...Array.from(uniqueCats)];
    }, [itemsData]);

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

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
                loading ? (
                    <Loading status={loading} />
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

                        {/* --- TOMBOL LOAD MORE --- */}
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
                        {/* ------------------------ */}
                    </div>
                )
            }
        </div>
    );
}

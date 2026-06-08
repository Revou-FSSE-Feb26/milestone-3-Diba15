"use client";

import ItemCard from "@/components/home/ItemCard";
import Loading from "@/components/ui/Loading";
import { categories, Item } from "@/types/Types";
import { useMemo, useState, useEffect } from "react";
import {getProducts} from "@/api"

export default function ProductList() {
    const [itemsData, setItemsData] = useState<Item[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                setLoading(true);
                const products = await getProducts();
                setItemsData(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        getAllProducts();
    }, []);

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredItems = useMemo(
        () =>
            itemsData.filter((item) => {
                const matchesCategory =
                    selectedCategory === "All" ||
                    item.category.toLowerCase() === selectedCategory.toLowerCase();
                const matchesName =
                    normalizedSearchTerm === "" ||
                    item.name.toLowerCase().includes(normalizedSearchTerm);
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
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {filteredItems.map((item) => (
                                <ItemCard key={item.id} Item={item} />
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                No products found for the selected search and category.
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
}
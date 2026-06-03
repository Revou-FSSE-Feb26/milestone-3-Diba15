import { categories, Item } from "@/types/Types";
import ItemCard from "@/components/home/ItemCard";
import items from "@/data/items.json";
import ActionButton from "@/components/home/ActionButton";
import Link from "next/link";

export default function Home() {
    const itemsData: Item[] = items.items;

    return (
        <div className="p-4">
            <div className="flex gap-2  transition-all cursor-pointer duration-300 w-full overflow-x-auto">
                {
                    categories.map((category) => (
                        <Link key={category} href={{ pathname: '/search', query: { searchTerm: encodeURIComponent(category) } }} className="hover:text-accent px-4 py-2 bg-accent/10 rounded-lg">
                            <h2>{category}</h2>
                        </Link>
                    ))
                }
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {itemsData.map((item) => (
                    <ItemCard key={item.id} Item={item} />
                ))}
            </div>

            {/* Validasi jika produk di kategori tersebut kosong */}
            {itemsData.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No products found in this category.
                </div>
            )}

            <ActionButton />
        </div>
    );
}

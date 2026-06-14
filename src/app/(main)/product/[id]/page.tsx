import Image from "next/image";
import AddCartButton from "@/components/detailItem/AddCartButton";
import CategoryPill from "@/components/ui/CategoryPill";
import ActionButton from "@/components/home/ActionButton";
import { Item } from "@/types/Types";
import { getProductById, getProductsWithPagination } from "@/api/index";
import Link from "next/link";
import { priceFormatter } from "@/utils";

export const revalidate = 300;

export async function generateStaticParams() {
    try {
        const products = await getProductsWithPagination(0, 8);
        return products.map(product => ({ id: product.id.toString() }));
    } catch (error) {
        console.error("Gagal mengambil data produk di server:", error);
        return [];
    }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id: number = Number(resolvedParams.id);

    let itemsData: Item | null = null;

    try {
        // Mengambil data langsung di sisi server saat build time (atau saat di-request jika ada ISR)
        itemsData = await getProductById(id);
    } catch (error) {
        console.error("Gagal mengambil detail produk di server:", error);
    }

    // Jika produk tidak ditemukan, tampilkan pesan fallback tanpa merusak halaman
    if (!itemsData) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto min-h-100">
                <div className="text-center text-gray-500 py-10">
                    Detail produk tidak ditemukan.
                </div>
                <ActionButton />
            </div>
        );
    }

    const productImage = itemsData.images && itemsData.images.length > 0
        ? itemsData.images[0]
        : "https://picsum.photos/800";

    return (
        <>
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
                <Link href="/" className="self-start items-center text-accent hover:text-secondary text-sm inline-flex gap-2 font-medium mb-2 transition-colors">
                    <i className="fa-solid fa-arrow-left"></i> Back to Home
                </Link>
                <h1 className="text-2xl font-bold mb-4 self-start">Product Detail</h1>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative w-75 h-75 shrink-0">
                        <Image
                            src={productImage}
                            alt={itemsData.title}
                            width={300}
                            height={300}
                            className="object-cover rounded-lg w-full h-full"
                            priority
                        />
                    </div>
                    <div className="flex flex-col gap-3 max-w-md justify-center">
                        <CategoryPill category={itemsData.category.name} />
                        <h2 className="text-xl font-bold text-gray-800">{itemsData.title}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{itemsData.description}</p>
                        <p className="text-lg font-extrabold text-gray-900">Price: {priceFormatter(itemsData.price)}</p>

                        {/* Komponen AddCartButton tetap dapat mempertahankan state "use client" di dalamnya.
                        Kita cukup mengirimkan data statis `itemsData` yang sudah siap pakai sebagai props.
                        */}
                        <AddCartButton item={itemsData} />
                    </div>
                </div>
            </div>

            <ActionButton />
        </>
    );
}
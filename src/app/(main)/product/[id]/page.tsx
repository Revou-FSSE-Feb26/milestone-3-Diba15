import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import AddCartButton from "@/components/detailItem/AddCartButton";
import CategoryPill from "@/components/ui/CategoryPill";
import ActionButton from "@/components/home/ActionButton";
import { Item } from "@/types/Types";
import { getProductById, getProductsWithPagination } from "@/lib/api";
import { priceFormatter } from "@/utils";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
    try {
        const products = await getProductsWithPagination({ offset: 0, limit: 8 });
        return products.map(product => ({ id: product.id.toString() }));
    } catch (error) {
        console.error("Gagal mengambil data produk di server:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const id: number = Number(resolvedParams.id);

    try {
        const product = await getProductById(id);
        if (!product) return { title: "Product Not Found" };

        return {
            title: `${product.title} | Revoshop`,
            description: product.description.substring(0, 160), // Ambil 160 karakter pertama
            openGraph: {
                images: product.images && product.images.length > 0 ? [product.images[0]] : [],
            }
        };
    } catch (error) {
        return { title: "Product | Revoshop" };
    }
}

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id: number = Number(resolvedParams.id);

    let itemsData: Item | null = null;

    try {
        itemsData = await getProductById(id);
    } catch (error) {
        console.error("Gagal mengambil detail produk di server:", error);
    }

    if (!itemsData) {
        notFound();
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
                    {/* PERBAIKAN TAILWIND: Ganti w-75 h-75 menjadi ukuran default (misal: w-80 h-80) atau w-[300px] h-[300px] */}
                    <div className="relative w-80 h-80 shrink-0">
                        <Image
                            src={productImage}
                            alt={itemsData.title}
                            width={320} // Disesuaikan dengan w-80 (320px)
                            height={320}
                            className="object-cover rounded-lg w-full h-full"
                            priority
                        />
                    </div>

                    <div className="flex flex-col gap-3 max-w-md justify-center">
                        <CategoryPill category={itemsData.category.name} />
                        <h2 className="text-xl font-bold text-gray-800">{itemsData.title}</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{itemsData.description}</p>
                        <p className="text-lg font-extrabold text-gray-900">Price: {priceFormatter(itemsData.price)}</p>

                        <AddCartButton item={itemsData} />
                    </div>
                </div>
            </div>

            <ActionButton />
        </>
    );
}
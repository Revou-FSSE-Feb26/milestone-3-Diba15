import items from "@/data/items.json";
import Image from "next/image";
import AddCartButton from "@/components/detailItem/addCartButton";
import {Item} from "@/types/Types";

const itemsData: Item[] = items.items;

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    // Await params-nya karena params adalah sebuah Promise
    const resolvedParams = await params;

    // Konversi id dari string URL menjadi number agar cocok dengan ID di JSON
    const id: number = Number(resolvedParams.id);

    // Cari item berdasarkan id yang tipenya sudah sama-sama number
    const item = itemsData.find((item) => item.id === id);

    // Berikan validasi jika produk tidak ditemukan
    if (!item) {
        return <div className="p-10 text-center">Produk tidak ditemukan!</div>;
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Product Detail</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <Image src={item.img_url} alt={item.name} width={300} height={300} className="object-cover w-auto h-auto rounded-lg" />
                <div className={"flex flex-col gap-2 max-w-md justify-center"}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <AddCartButton item={item} />
                </div>
            </div>
        </div>
    );
}
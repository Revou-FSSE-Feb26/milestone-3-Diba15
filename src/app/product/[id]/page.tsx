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
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-4">Product Detail</h1>
            <div className={"flex flex-row gap-3 justify-around"}>
                <Image src={item.img_url} alt={item.name} width={300} height={300} />
                <div className={"flex flex-col gap-2 max-w-md"}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                </div>
            </div>
            <AddCartButton item={item} />
        </div>
    );
}
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function ActionButton() {
    const { cart } = useCart();

    // Hitung total jumlah barang di dalam keranjang secara otomatis
    // Menggunakan reduce agar jika user beli 2 iPhone, angka keranjang bertambah 2, bukan 1
    const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);


    return (
        <Link href="/cart" className="fixed bottom-4 right-4 flex md:hidden gap-2 items-center rounded-full bg-accent p-4 text-white transition-colors cursor-pointer">
            {cartTotal > 0 && (
                <span
                    className="absolute -top-2 -right-2 bg-accent text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-xs font-bold animate-fade-in">
                    {cartTotal}
                </span>
            )}

            {/* Ikon Keranjang Belanja */}
            <i className="fa-solid fa-cart-shopping text-xl cursor-pointer transition-colors"></i>
        </Link>
    );
}
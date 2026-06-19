"use client";

import { Tag, Copy, Clock, Sparkles, ShoppingBag } from "lucide-react";
import { useNotif } from "@/contexts/NotifContext";

// Data statis (Mock Data) untuk daftar promosi
const PROMO_DATA = [
    {
        id: 1,
        title: "Welcome Bonus",
        description: "Dapatkan diskon 20% untuk pembelian pertamamu tanpa minimum belanja.",
        code: "REVONEW20",
        discount: "20%",
        expiry: "Berlaku hingga 31 Des 2026",
        color: "bg-blue-50 border-blue-200 text-blue-700",
        iconColor: "text-blue-500"
    },
    {
        id: 2,
        title: "Free Shipping Promo",
        description: "Gratis ongkir ke seluruh Indonesia dengan minimum belanja Rp 150.000.",
        code: "FREESHIPID",
        discount: "100%",
        expiry: "Berlaku hingga 15 Nov 2026",
        color: "bg-green-50 border-green-200 text-green-700",
        iconColor: "text-green-500"
    },
    {
        id: 3,
        title: "Payday Flash Sale",
        description: "Potongan harga spesial akhir bulan untuk semua kategori elektronik dan fashion.",
        code: "PAYDAYYAY",
        discount: "Rp 50K",
        expiry: "Berakhir dalam 2 hari",
        color: "bg-rose-50 border-rose-200 text-rose-700",
        iconColor: "text-rose-500"
    }
];

export default function Promotions() {
    const { triggerToast } = useNotif();

    // Fungsi untuk menyalin kode promo ke clipboard
    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        triggerToast(`Kode promo ${code} berhasil disalin!`, "success");
    };

    return (
        <div className="bg-gray-50 pb-12">
            {/* PROMO LIST SECTION */}
            <div className="max-w-5xl mx-auto px-6 sm:px-8 mt-12">
                <div className="flex items-center gap-3 mb-8 text-gray-800">
                    <Tag className="h-7 w-7 text-primary" />
                    <h2 className="text-2xl font-bold">Voucher Aktif</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROMO_DATA.map((promo) => (
                        <div
                            key={promo.id}
                            className={`flex flex-col justify-between border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white relative overflow-hidden`}
                        >
                            {/* Aksen visual di pojok atas */}
                            <div className={`absolute top-0 right-0 w-16 h-16 ${promo.color} rounded-bl-full z-0 opacity-50`}></div>

                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-xl ${promo.color}`}>
                                        <ShoppingBag className={`h-6 w-6 ${promo.iconColor}`} />
                                    </div>
                                    <span className="font-extrabold text-xl text-primary">{promo.discount}</span>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{promo.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                                        {promo.description}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex flex-col gap-4 mt-6 pt-4 border-t border-dashed border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <Clock className="h-4 w-4" />
                                    {promo.expiry}
                                </div>

                                <div className="flex items-center justify-between gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200 border-dashed">
                                    <span className="font-mono font-bold text-gray-700 tracking-wider pl-3">
                                        {promo.code}
                                    </span>
                                    <button
                                        onClick={() => handleCopyCode(promo.code)}
                                        className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-md text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors shadow-sm cursor-pointer"
                                    >
                                        <Copy className="h-4 w-4" />
                                        Salin
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE FALLBACK (Jika promo habis nantinya) */}
                {PROMO_DATA.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Tag className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">Belum Ada Promo Saat Ini</h3>
                        <p className="text-gray-500 mt-2">Cek kembali nanti untuk penawaran menarik lainnya!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
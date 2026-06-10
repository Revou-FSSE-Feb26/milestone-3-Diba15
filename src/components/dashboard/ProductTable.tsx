import { Item } from "@/types/Types";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Edit3, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface TableProps {
    products: Item[];
    handleEdit: (product: Item) => void
    handleDelete: (id: number) => void
}

export default function ProductTable({ products, handleEdit, handleDelete }: TableProps) {
    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    
    // Menghitung jumlah halaman
    const totalPages = Math.ceil(products.length / itemsPerPage)

    // Memotong array produk agar hanya menampilkan data di halaman aktif
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return products.slice(start, start + itemsPerPage)
    }, [products, currentPage, itemsPerPage])

    // Fungsi navigasi halaman
    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNumber)
    }

    // Informasi teks entry data
    const entryStart = products.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const entryEnd = Math.min(currentPage * itemsPerPage, products.length)

    // Menghitung halaman yang akan ditampilkan (maksimal 5)
    const getVisiblePages = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-gray-800 text-lg">Daftar Produk ({products.length})</h3>

                {/* Selector jumlah data per halaman */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Show</span>
                    <select
                        title="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value))
                            setCurrentPage(1) // Reset ke halaman pertama saat ukuran halaman berubah
                        }}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1 focus:border-primary focus:outline-none text-xs font-bold"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-gray-600">
                    <thead>
                        <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50/30">
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Preview</th>
                            <th className="py-4 px-6">Title</th>
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Price</th>
                            <th className="py-4 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 font-bold text-gray-900">#{product.id}</td>
                                <td className="py-4 px-6">
                                    {product.images && product.images.length > 0 ? (
                                        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-400">
                                            <ImageIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-6 font-medium text-gray-900 max-w-xs truncate">
                                    {product.title}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
                                        {product.category.name}
                                    </span>
                                </td>
                                <td className="py-4 px-6 font-extrabold text-gray-950">
                                    ${Number(product.price).toFixed(2)}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(product)}
                                            title="Edit produk"
                                            className="rounded-lg p-2 text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                        >
                                            <Edit3 className="h-4.5 w-4.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(product.id)}
                                            title="Hapus produk"
                                            className="rounded-lg p-2 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="h-4.5 w-4.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-gray-400">
                                    Belum ada produk yang ditambahkan. Silakan isi form di atas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer Controls */}
            {products.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50/50">
                    {/* Keterangan entri */}
                    <p className="text-sm text-gray-500 text-center sm:text-left">
                        Showing <span className="font-semibold text-gray-800">{entryStart}</span> to{" "}
                        <span className="font-semibold text-gray-800">{entryEnd}</span> of{" "}
                        <span className="font-semibold text-gray-800">{products.length}</span> entries
                    </p>

                    {/* Tombol halaman */}
                    <div className="flex items-center justify-center gap-1.5">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border cursor-pointer  border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="Previous Page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {getVisiblePages().map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${currentPage === page
                                    ? "bg-primary border-primary hover:bg-accent hover:border-accent text-white shadow-sm"
                                    : "border-gray-200 bg-white hover:bg-primary text-gray-600 hover:text-white"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border cursor-pointer border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="Next Page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
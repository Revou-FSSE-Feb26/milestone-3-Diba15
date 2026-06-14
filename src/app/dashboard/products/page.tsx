"use client"

import { useState } from "react"
import useSWR from 'swr';
import { useForm } from "react-hook-form"
import { Item, PlatziCategory } from "@/types/Types";
import Link from "next/link";
import { getProducts, postProducts, updateProduct, deleteProduct, getCategories } from "@/api";
import ProductTable from "@/components/dashboard/ProductTable";
import Input from "@/components/ui/form/Input";
import TextArea from "@/components/ui/form/TextArea";
import SelectInput from "@/components/ui/form/SelectInput";
import { useCart } from "@/context/CartContext";

interface ProductFormValues {
    images: string;
    title: string;
    price: number;
    category: number;
    description: string;
}

export default function DashboardProducts() {
    const [editingId, setEditingId] = useState<number | null>(null)
    const { triggerToast, triggerModal } = useCart();

    const {
        data: products = [],
        mutate,
        isLoading,
        error
    } = useSWR<Item[]>("dashboard-products", getProducts);

    const {
        data: categories = [],
    } = useSWR<PlatziCategory[]>("categories", getCategories);

    // Inisialisasi React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<ProductFormValues>({
        defaultValues: {
            images: "",
            title: "",
            price: 0,
            category: 1,
            description: "",
        }
    })

    /**
     * Reset form
     * Set editingId null
     * Reset nilai form
     * 
     * @returns void
     */
    const resetForm = () => {
        setEditingId(null)
        reset({
            images: "",
            title: "",
            price: 0,
            category: 1,
            description: "",
        })
    }

    /**
     * Submit form
     * Jika ada editingId, maka update product
     * Jika tidak ada editingId, maka tambahkan product
     * 
     * @param data 
     */
    const onSubmit = async (data: ProductFormValues) => {
        const parsedImages = data.images
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)

        try {
            if (editingId !== null) {
                const updatedPayload = {
                    title: data.title,
                    price: Number(data.price),
                    description: data.description,
                    categoryId: data.category,
                    images: parsedImages
                };

                // Kenapa menggunakan 2 as unknown dan Item?
                // Karena kita tidak tahu apakah data yang dikirimkan adalah Item atau tidak.
                await updateProduct(editingId, updatedPayload as unknown as Item);
                triggerToast("Product updated successfully", "success");
            } else {
                const newPayload = {
                    title: data.title,
                    price: Number(data.price),
                    description: data.description,
                    categoryId: data.category,
                    images: parsedImages
                };

                await postProducts(newPayload as unknown as Item);
                triggerToast("Product added successfully", "success");
            }

            // Fetch ulang produk setelah perubahan
            await mutate();
            resetForm()
        } catch (error) {
            console.error("Gagal menyimpan produk:", error);
            alert("Terjadi kesalahan saat menyimpan produk. Coba lagi.");
        }
    }

    /**
     * Handle edit product
     * Set editingId dengan id produk yang akan diedit
     * Set nilai form dengan data produk yang akan diedit
     * 
     * @param product 
     */
    const handleEdit = (product: Item) => {
        setEditingId(product.id)
        setValue("images", product.images.join(", "))
        setValue("title", product.title)
        setValue("price", Number(product.price))
        setValue("category", product.category.id)
        setValue("description", product.description)
    }

    /**
     * Handle delete product
     * Konfirmasi terlebih dahulu
     * Hapus produk
     * Fetch ulang produk setelah perubahan
     * 
     * @param id 
     */
    const handleDelete = async (id: number) => {

        try {
            triggerModal(
                `Are you sure you want to delete this product?`,
                "confirmation",
                async () => {
                    await deleteProduct(id);
                    await mutate();
                    triggerToast("Product deleted successfully", "success");
                })

            if (editingId === id) resetForm()
        } catch (error) {
            console.error("Gagal menghapus produk:", error);
            alert("Terjadi kesalahan saat menghapus produk.");
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 sm:p-8 border border-gray-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="text-accent hover:text-secondary text-sm inline-flex items-center gap-2 font-medium mb-2 transition-colors">
                            <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight">Products Management</h1>
                        <p className="text-sm text-gray-500">Manage your products</p>
                    </div>
                </div>

                {/* CRUD Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <h2 className="text-lg font-bold">{editingId ? "Edit Produk Saat Ini" : "Tambah Produk Baru"}</h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Input Title and Price */}
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Input Title */}
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    type="text"
                                    {...register("title", { required: "Product title is required" })}
                                    placeholder="Contoh: Classic Red Jogger" label="Product Title"
                                />
                                {errors.title && <p className="text-accent text-xs mt-0.5">{errors.title.message}</p>}
                            </div>

                            {/* Input Price */}
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("price", {
                                        required: "Price is required",
                                        min: { value: 0.01, message: "Price must be greater than 0" }
                                    })}
                                    placeholder="99.99" label="Product Price"
                                />
                                {errors.price && <p className="text-accent text-xs mt-0.5">{errors.price.message}</p>}
                            </div>
                        </div>

                        {/* Input Category and Images  */}
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <SelectInput
                                    options={categories.map(category => ({ label: category.name, value: String(category.id) }))}
                                    {...register("category", { required: "Product category is required" })}
                                    label="Product Category"
                                />
                                {errors.category && <p className="text-accent text-xs mt-0.5">{errors.category.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    type="text"
                                    {...register("images", { required: "At least one image URL is required" })}
                                    placeholder="https://picsum.photos/640, https://picsum.photos/650" label="Product Images"
                                />
                                {errors.images && <p className="text-accent text-xs mt-0.5">{errors.images.message}</p>}
                            </div>
                        </div>

                        {/* Input Description */}
                        <div className="flex flex-col gap-1.5">
                            <TextArea
                                rows={3}
                                {...register("description", { required: "Description is required" })}
                                placeholder="Tuliskan deskripsi lengkap mengenai kualitas dan ukuran produk..."
                                label="Product Description"
                            />
                            {errors.description && <p className="text-accent text-xs mt-0.5">{errors.description.message}</p>}
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-primary hover:bg-accent text-white px-6 py-2.5 text-sm font-bold shadow-sm transition-all cursor-pointer"
                            >
                                {editingId ? "Simpan Perubahan" : "Tambah Produk"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Products Table with Pagination */}
                <ProductTable products={products} handleEdit={handleEdit} handleDelete={handleDelete} />
                {isLoading && <p className="text-sm text-gray-500">Loading products...</p>}
                {error && <p className="text-sm text-red-500">Failed to load products.</p>}
            </div>
        </div>
    )
}
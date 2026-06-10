"use client";

import { ShoppingCart, Users } from "lucide-react"
import StatCard from "@/components/dashboard/StatCard"
import { getUsers, getProducts } from "@/api";
import { useEffect, useState } from "react";
import { Item } from "@/types/Types";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState<Item[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userData = await getUsers();
            setUsers(userData);
        }

        const fetchProducts = async () => {
            const productData = await getProducts();
            setProducts(productData);
        }

        fetchUsers();
        fetchProducts();
    }, []);

    const totalUsers = () => {
        return users.length;
    }

    const totalProducts = () => {
        return products.length;
    }


    return (
        <div className="space-y-8 bg-background text-foreground p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-2 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="max-w-2xl text-sm text-gray-400">Dashboard Stats page</p>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Active Users"
                        value={totalUsers().toString()}
                        icon={<Users className="h-6 w-6 text-cyan-400" />}
                    />
                    <StatCard
                        title="Total Products"
                        value={totalProducts ? totalProducts().toString() : "0"}
                        icon={<ShoppingCart className="h-6 w-6 text-emerald-400" />}
                    />
                </section>
            </div>
        </div>
    )
}
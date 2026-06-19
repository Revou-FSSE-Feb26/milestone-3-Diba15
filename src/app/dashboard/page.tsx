"use client";

import { ShoppingCart, Users, Package } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useState, useEffect } from "react";
import { useNotif } from "@/contexts/NotifContext";
import { Item, PlatziCategory, Me } from "@/types/Types";

export default function Dashboard() {
    const [users, setUsers] = useState<Me[]>([]);
    const [products, setProducts] = useState<Item[]>([]);
    const [categories, setCategories] = useState<PlatziCategory[]>([]);
    const { triggerToast } = useNotif();

    useEffect(() => {
        fetch("api/users")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => setUsers(data))
            .catch(() => triggerToast("Error fetching users data!", "error"));

        fetch("api/products")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => setProducts(data))
            .catch(() => triggerToast("Error fetching products data!", "error"));

        fetch("api/categories")
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch(() => triggerToast("Error fetching categories data!", "error"));
    }, [triggerToast]);

    return (
        <div className="space-y-8 bg-background text-foreground p-6 sm:p-8 border border-gray-200">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-2 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="max-w-2xl text-sm text-gray-400">Dashboard Stats page</p>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Active Users"
                        value={users.length.toString()}
                        icon={<Users className="h-6 w-6 text-primary" />}
                    />
                    <StatCard
                        title="Total Products"
                        value={products.length.toString()}
                        icon={<ShoppingCart className="h-6 w-6 text-accent" />}
                    />
                    <StatCard
                        title="Total Categories"
                        value={categories.length.toString()}
                        icon={<Package className="h-6 w-6 text-primary" />}
                    />
                </section>
            </div>
        </div>
    )
}
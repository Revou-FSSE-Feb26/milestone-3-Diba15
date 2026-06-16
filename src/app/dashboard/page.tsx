"use client";

import { ShoppingCart, Users, Package } from "lucide-react";
import useSWR from 'swr';
import StatCard from "@/components/dashboard/StatCard";

// Fetcher standard untuk SWR di sisi client
const clientFetcher = (url: string) => fetch(url).then((res) => res.json());


export default function Dashboard() {
    const { data: users = [] } = useSWR("api/users", clientFetcher);
    const { data: products = [] } = useSWR("api/products", clientFetcher);
    const { data: categories = [] } = useSWR("api/categories", clientFetcher);

    const totalUsers = () => {
        return users.length;
    }

    const totalProducts = () => {
        return products.length;
    }

    const totalCategories = () => {
        return categories.length;
    }

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
                        value={totalUsers().toString()}
                        icon={<Users className="h-6 w-6 text-primary" />}
                    />
                    <StatCard
                        title="Total Products"
                        value={totalProducts ? totalProducts().toString() : "0"}
                        icon={<ShoppingCart className="h-6 w-6 text-accent" />}
                    />
                    <StatCard
                        title="Total Categories"
                        value={totalCategories ? totalCategories().toString() : "0"}
                        icon={<Package className="h-6 w-6 text-primary" />}
                    />
                </section>
            </div>
        </div>
    )
}
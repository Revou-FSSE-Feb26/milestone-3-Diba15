"use client"

import React from "react";
import Footer from "@/components/ui/Footer"
import NavbarDashboard from "@/components/dashboard/NavbarDashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col h-full">
            <header className="sticky top-0 z-50 bg-primary">
                <NavbarDashboard />
            </header>

            <main className="flex flex-1 flex-col p-4">
                {children}
            </main>

            <Footer />
        </div>
    )
}
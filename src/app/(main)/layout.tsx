import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <>
        <header className="sticky top-0 z-50 bg-primary">
            <Navbar />
        </header>
        <main className={"flex-1 flex flex-col bg-background justify-center"}>
            {children}
        </main>
        <Footer />
    </>
}
import type {Metadata} from "next";
import { Poppins} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {CartProvider} from "@/context/CartContext";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Revoshop",
    description: "Simple e-commerce application built with Next.js and Tailwind CSS",
    authors: [{'name': 'Dimas Bagas'}],
    keywords: ['e-commerce', 'nextjs', 'tailwindcss'],
    creator: 'Dimas Bagas',
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html
            lang="en"
            className={`h-full antialiased ${poppins.className}`}
        >
            <body className="min-h-full flex flex-col">
                <CartProvider>
                    <header>
                        <Navbar/>
                    </header>
                    <main className={"flex-1 flex flex-col"}>
                        {children}
                    </main>
                    <footer>
                        <Footer/>
                    </footer>
                </CartProvider>
            </body>
            <Script
                src="https://kit.fontawesome.com/c0f92099a8.js"
                crossOrigin="anonymous"
                strategy="lazyOnload" // Mengoptimalkan performa loading
            />
        </html>
    );
}

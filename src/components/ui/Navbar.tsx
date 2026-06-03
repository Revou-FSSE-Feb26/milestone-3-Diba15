"use client";

import Brand from "@/components/ui/Brand";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
    // Ambil data 'cart' dari context
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchTerm.trim() !== "") {
            // Arahkan ke halaman pencarian dengan query parameter
            router.push(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
        }
    }

    return (
        <nav className="text-white p-4 flex flex-wrap gap-4 justify-between items-center">
            <div>
                <Brand />
            </div>

            {/* Search Bar */}
            <form onSubmit={(e) => handleSearch(e)} className="flex items-center justify-between gap-2 w-full max-w-md bg-white rounded-full px-4 py-2 group">
                <input
                    type="text"
                    placeholder="Search products..."
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className=" w-fit md:w-full rounded-full text-black focus:outline-none transition duration-300"
                />
                <button title="Search" className="text-white bg-accent px-4 py-0.5 rounded-full hover:bg-accent-dark transition-colors cursor-pointer">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
        </nav>
    );
}
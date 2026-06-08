"use client";

import Brand from "@/components/ui/Brand";

export default function Navbar() {
    return (
        <nav className="text-white p-4 flex flex-wrap gap-4 justify-between items-center">
            <div>
                <Brand />
            </div>
        </nav>
    );
}
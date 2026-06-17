"use client";

import Brand from "@/components/ui/Brand";
import { LogIn, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useUser();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        router.push("/login");
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    // Pasang event listener untuk mendeteksi klik di luar elemen
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Jika elemen ref ada dan yang di-klik bukan bagian dari ref tersebut (di luar dropdown)
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Daftarkan event listener ke document
        document.addEventListener("mousedown", handleClickOutside);

        // Bersihkan event listener saat komponen unmount (cleanup)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const dropdownClass = `
    ${isDropdownOpen ? "block" : "hidden"} 
    flex flex-col gap-2 items-start absolute top-12 right-0 bg-white 
    *:hover:underline min-w-[140px]
    p-4 rounded-md shadow-md z-10 text-gray-500 border border-gray-100`

    return (
        <nav className="text-white p-4 flex flex-wrap gap-4 justify-between items-center relative">
            <div>
                <Brand />
            </div>

            {
                user && user.id === 0 ? (
                    <Link href="/login">
                        <LogIn className="cursor-pointer hover:text-accent transition-colors" />
                    </Link>
                ) : (
                    <div className="flex gap-2 relative" ref={dropdownRef}>
                        <div className="flex items-center cursor-pointer select-none" onClick={toggleDropdown}>
                            <Image
                                src={user?.avatar || "https://picsum.photos/200"}
                                alt="avatar"
                                width={32}
                                height={32}
                                className="rounded-full border border-white/20"
                            />
                            <span className="ml-2 font-medium">{user?.name}</span>
                            <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>

                        {/* Dropdown menu */}
                        <div className={dropdownClass}>
                            {user?.role === "admin" && (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full text-left py-1 hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                                className="w-full text-left py-1 text-rose-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )
            }
        </nav>
    );
}
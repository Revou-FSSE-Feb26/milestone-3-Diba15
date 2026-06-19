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
    const { user, success, logout } = useUser(); // Ambil success (isLoggedIn) dari context
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        router.push("/login");
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    // Event listener untuk klik di luar dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Hindari event trigger bertumpuk jika menu tidak terbuka
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Menggunakan kombinasi pointer-events, opacity, dan scale agar transisi mulus
    const dropdownClass = `
        absolute top-12 right-0 min-w-[150px] bg-white border border-gray-100 rounded-lg shadow-xl p-2 z-50 text-gray-700
        transition-all duration-200 ease-in-out origin-top-right
        ${isDropdownOpen 
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0" 
            : "opacity-0 scale-95 pointer-events-none -translate-y-2"
        }
    `;

    return (
        <nav className="text-white p-4 flex flex-wrap gap-4 justify-between items-center relative">
            <div>
                <Brand />
            </div>

            {/* 
                Cek 'success' (status localStorage). Jika false, pasti belum login. 
            */}
            {!success ? (
                <Link href="/login" className="flex items-center gap-2 group">
                    <LogIn className="cursor-pointer text-white/80 group-hover:text-accent transition-colors" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-accent transition-colors">Sign In</span>
                </Link>
            ) : (
                <div className="flex gap-2 relative" ref={dropdownRef}>
                    <button 
                        type="button"
                        className="flex items-center gap-2 cursor-pointer select-none bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-white/10" 
                        onClick={toggleDropdown}
                    >
                        <Image
                            src={user?.avatar?.startsWith('http') ? user.avatar : "https://picsum.photos/200"}
                            alt="avatar"
                            width={32}
                            height={32}
                            className="rounded-full object-cover w-8 h-8 border border-white/20"
                        />
                        {/* Munculkan loading dots jika user.name masih kosong (SWR sedang fetch) */}
                        <span className="font-medium text-sm">
                            {user?.name || "Loading..."}
                        </span>
                        <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                        />
                    </button>

                    {/* Dropdown menu */}
                    <div className={dropdownClass}>
                        <div className="flex flex-col gap-1 w-full">
                            {user?.role === "admin" && (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <Link
                                href="/profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-primary transition-colors font-medium"
                            >
                                Profile
                            </Link>
                            
                            <hr className="my-1 border-gray-100" />
                            
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-sm rounded-md text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
// This file defines the types for the items, cart items, and shopping cart in the application.

export interface PlatziCategory {
    id: number;
    name: string;
    image: string;
}

export interface Item {
    id: number;
    title: string; // Platzi menggunakan 'title', bukan 'name'
    price: number; // Platzi menggunakan number
    description: string;
    images: string[]; // Platzi menggunakan array of strings
    category: PlatziCategory; // Platzi menggunakan object category
    // Platzi tidak memiliki properti 'stock' bawaan, tapi kita bisa berikan opsi optional jika tetap butuh di UI
    stock?: number;
}

// This type will be used to represent an item in the shopping cart
export interface CartItem extends Item {
    userId: number;
    quantity: number;
}

// User Types
export interface Me {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string; // Platzi memiliki avatar
}

export interface LoginProps {
    email: string;
    password: string;
}

export interface RegisterUser {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    role?: "user" | "admin";
    avatar?: string;
}
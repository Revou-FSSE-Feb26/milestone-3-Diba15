import axios from "axios";
import { Item, Me } from "@/types/Types";

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

// --- Products API ---

export const getProducts = async (): Promise<Item[]> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductById = async (id: number): Promise<Item> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}

// Platzi menggunakan categoryId untuk filter produk berdasarkan kategori
export const getProductsByCategory = async (categoryId: number): Promise<Item[]> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/products/`, { params: { categoryId: categoryId } });
        return response.data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
}

// Platzi menggunakan parameter 'title' untuk mencari nama produk
export const searchProducts = async (searchTerm: string): Promise<Item[]> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/products/`, { params: { title: searchTerm } });
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}

// --- User API ---

export const getUserById = async (id: number): Promise<Me> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}
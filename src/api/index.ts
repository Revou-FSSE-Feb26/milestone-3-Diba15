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

export const postProducts = async (product: Item): Promise<{success: boolean, product: Item}> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.post(`${API_URL}/products/`, product);
        return {
            success: true,
            product: response.data
        }
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}

export const updateProduct = async (id: number, product: Item): Promise<{ success: boolean, product: Item }> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.put(`${API_URL}/products/${id}`, product);
        return {
            success: true,
            product: response.data
        };
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

export const deleteProduct = async (id: number): Promise<void> => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        await axios.delete(`${API_URL}/products/${id}`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}

// Categories API

export const postCategories = async (name: string, image: string) => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.post(`${API_URL}/categories`, { name, image });
        return {
            success: true,
            categories: response.data
        }
    } catch (error) {
        console.error("Error posting product:", error);
        throw error;
    }
}

// --- User API ---

export const getUsers = async () => {
    if (!API_URL) throw new Error("API_URL is not defined.");
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

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
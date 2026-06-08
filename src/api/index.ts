import axios from "axios";
import { Item, Me} from "@/types/Types";

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

// Products API

export const getProducts = async (): Promise<Item[]> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getProductById = async (id: number): Promise<Item> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);

        return response.data; // Return the product data directly if it's not an array
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}

export const getProductsByCategory = async (category: string): Promise<Item[]> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/products/`, { params: { category: category } });
        return response.data;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        throw error;
    }
}

export const searchProducts = async (searchTerm: string): Promise<Item[]> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/products/`, { params: { name: searchTerm } });
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}

// User API

export const getUserById = async (id: number): Promise<Me> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}
import axios from "axios";
import { Item, CartItem } from "@/types/Types";

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

// Cart API

export const getCartItems = async (): Promise<CartItem[]> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const response = await axios.get(`${API_URL}/cart`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error;
    }
}

export const addCart = async (item: Item): Promise<void> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        await axios.post(`${API_URL}/cart`, { productId: item.id, quantity: 1 });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
}

export const updateCart = async (itemId: number, quantity: number): Promise<void> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        await axios.put(`${API_URL}/cart/${itemId}`, { quantity });
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
}

export const deleteCart = async (itemId: number): Promise<void> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        await axios.delete(`${API_URL}/cart/${itemId}`);
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw error;
    }
}


export const clear = async (item: Item[]): Promise<void> => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        item.forEach(async (item) => {
            await axios.delete(`${API_URL}/cart/${item.id}`);
        })
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}
import { Item } from "@/types/Types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("API_URL is not defined.");
}

// Public API
export const publicApi = axios.create({
    baseURL: API_URL,
});

// --- Products API ---

interface PaginationParams {
    offset: number;
    limit: number;
    title?: string;
    categoryId?: number;
}

export const getProductsWithPagination = async (
    { offset, limit, title, categoryId }: PaginationParams): Promise<Item[]> => {
    try {
        const params: PaginationParams = {
            offset: offset,
            limit: limit
        }
        if (title) params.title = title;
        if (categoryId) params.categoryId = categoryId;

        const response = await publicApi.get(`/products`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching products with pagination:", error);
        throw error;
    }
}

export const getProductById = async (id: number): Promise<Item> => {
    try {
        const response = await publicApi.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}
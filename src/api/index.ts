import axios from "axios";
import { Item, Me, LoginProps, RegisterUser } from "@/types/Types";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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

export const registerUser = async (user: RegisterUser) => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const { password, confirmPassword } = user;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        user = { name: user.name, email: user.email, password: hashedPassword, role: "user" };

        const response = await axios.post(`${API_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

// 
export const loginUser = async (user: LoginProps) => {
    if (!API_URL) {
        throw new Error("API_URL is not defined in the environment variables.");
    }
    try {
        const { email, password } = user;

        const response = await axios.get(`${API_URL}/users`);
        const usersData = response.data;

        const users = usersData.find((user: LoginProps) => user.email === email);

        if (!users) {
            throw new Error("User not found");
        }

        const matchPassword = await bcrypt.compare(password, users.password);
        if (!matchPassword) {
            throw new Error("Password does not match");
        }

        const me: Me = {
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role
        };

        localStorage.setItem("me", JSON.stringify(me));

        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("me");
};
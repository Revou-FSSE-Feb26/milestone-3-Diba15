"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";
import { Item, CartItem } from "@/types/Types";
import { useUser } from "./UserContext";
import { useNotif } from "./NotifContext";

type CartAction = 
    | { type: "INITIALIZE_CART"; payload: CartItem[] }
    | { type: "ADD_TO_CART"; payload: { item: Item; userId: number } }
    | { type: "REMOVE_FROM_CART"; payload: { itemId: number; userId: number } }
    | { type: "DECREASE_QUANTITY"; payload: { itemId: number; userId: number } }
    | { type: "CLEAR_CART"; payload: { userId: number } };

// Buat Reducer yang MURNI (Pure Function), tanpa efek samping (seperti Toast/API)
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case "INITIALIZE_CART":
            return action.payload;

        case "ADD_TO_CART": {
            const { item, userId } = action.payload;
            const existing = state.find(c => c.id === item.id && c.userId === userId && !c.status);
            if (existing) {
                return state.map(c => 
                    c.id === item.id && c.userId === userId && !c.status
                        ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...state, { ...item, quantity: 1, userId, status: false }];
        }

        case "REMOVE_FROM_CART":
            return state.filter(c => !(c.id === action.payload.itemId && c.userId === action.payload.userId && !c.status));

        case "DECREASE_QUANTITY":
            return state.map(c => 
                c.id === action.payload.itemId && c.userId === action.payload.userId && !c.status
                    ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c
            );

        case "CLEAR_CART":
            return state.map(c => 
                c.userId === action.payload.userId && !c.status ? { ...c, status: true } : c
            );

        default:
            return state;
    }
}

interface CartContextValue {
    cart: CartItem[];
    activeCart: CartItem[];
    dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, dispatch] = useReducer(cartReducer, []);
    const { user } = useUser();

    // tetap menggunakan useEffect untuk mengambil data dari localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                dispatch({ type: "INITIALIZE_CART", payload: JSON.parse(storedCart) });
            }
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else if (cart.length === 0 && typeof window !== "undefined" && localStorage.getItem("cart")) {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    const activeCart = useMemo(() => {
        return cart.filter(item => item.userId === user?.id && !item.status);
    }, [cart, user?.id]);

    const contextValue = useMemo(() => ({
        cart,
        activeCart,
        dispatch
    }), [cart, activeCart, dispatch]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside a <CartProvider>");
    return context;
}
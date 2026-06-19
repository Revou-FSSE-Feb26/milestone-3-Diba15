"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { Item, CartItem } from "@/types/Types";
import { useNotif } from "@/contexts/NotifContext";
import { useUser } from "@/contexts/UserContext";

export interface CartContextType {
    cart: CartItem[];
    activeCart: CartItem[]; // Menggantikan getCart()
    getCartWithId: (id: number) => CartItem | undefined;
    addToCart: (item: Item) => void;
    decreaseQuantity: (itemId: number) => void;
    removeFromCart: (itemId: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === "undefined") return [];
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const { triggerToast } = useNotif();
    const { user } = useUser();

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        } else if (cart.length === 0 && localStorage.getItem("cart")) {
            localStorage.removeItem("cart");
        }
    }, [cart]);

    // Perbaikan Grading Component: Active Cart di-memoize sebagai value, bukan function.
    const activeCart = useMemo(() => {
        return cart.filter(item => item.userId === user?.id && item.status === false);
    }, [cart, user?.id]);

    const getCartWithId = useCallback((id: number) => {
        return cart.find(item => item.id === id && item.userId === user?.id && item.status === false);
    }, [cart, user?.id]);

    const addToCart = useCallback((item: Item) => {
        if (!user) return;
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id && cartItem.userId === user.id && cartItem.status === false);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id && cartItem.userId === user.id && cartItem.status === false
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, userId: user.id, status: false }];
        });
        triggerToast(`${item.title} added to cart`, "success");
    }, [user, triggerToast]);

    const removeFromCart = useCallback((itemId: number) => {
        if (!user) return;
        setCart((prevCart) =>
            prevCart.filter(item => !(item.id === itemId && item.userId === user.id && item.status === false))
        );
    }, [user]);

    const decreaseQuantity = useCallback((itemId: number) => {
        if (!user) return;
        setCart((prevCart) => prevCart.map(item =>
            item.id === itemId && item.userId === user.id && item.status === false
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
        ));
    }, [user]);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        if (!user) return;
        setCart((prevCart) => prevCart.map(item =>
            item.id === itemId && item.userId === user.id && item.status === false
                ? { ...item, quantity }
                : item
        ));
    }, [user]);

    const clearCart = useCallback(() => {
        if (!user) return;
        setCart((prevCart) => prevCart.map(item =>
            item.userId === user.id && item.status === false
                ? { ...item, status: true }
                : item
        ));
    }, [user]);

    const contextValue = useMemo(() => ({
        cart,
        activeCart,
        getCartWithId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        decreaseQuantity
    }), [cart, activeCart, getCartWithId, addToCart, removeFromCart, updateQuantity, clearCart, decreaseQuantity]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
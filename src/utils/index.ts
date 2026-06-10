import { CartItem } from "@/types/Types";

export const priceFormatter = (price: number): string => {
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
};

export const cartTotalPrice = (cart: CartItem[]): string => {
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    return priceFormatter(total);
}

export const totalCartItems = (cart: CartItem[]): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
}
import { CartItem, Item } from "@/types/Types";

export const filterItemsByCategory = (items: Item[], category: string): Item[] => {
    if (category === "All") {
        return items;
    }
    return items.filter((item) => item.category === category);
};

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
// This file defines the types for the items, cart items, and shopping cart in the application.
export interface Item {
    id: number,
    name: string,
    price: string | number,
    img_url: string,
    description: string,
    category: string,
    stock: number,
}

// This type will be used to represent an item in the shopping cart, which includes all
// the properties of an item as well as a quantity property to indicate how many of that item are in the cart.
export interface CartItem extends Item {
    productId: number,
    quantity: number,
}

// This type will be used to represent the shopping cart,
// which contains an array of CartItem objects and a total price for the items in the cart.
export interface CartContextType {
    cart: CartItem[],
    addToCart: (item: Item) => void,
    decreaseQuantity: (itemId: number) => void,
    removeFromCart: (itemId: number) => void,
    updateQuantity: (itemId: number, quantity: number) => void,
    clearCart: (item: Item[]) => void,
    triggerToast: (message: string, type: 'success' | 'error' | 'warning') => void;
    clearToast: () => void;
    triggerModal: (msg: string, modalType: 'confirmation' | 'alert', yesAction?: () => void, noAction?: () => void) => void;
}

export const categories: string[] = [
    "All",
    "Electronic",
    "Men Clothing",
    "Women Clothing",
    "Jewelry"
]

// This type will be used to ensure that the category of an item is one of the predefined categories in the categories array.
export type Category = typeof categories[number];

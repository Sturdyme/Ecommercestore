import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import toast from "react-hot-toast";


const CartContext = createContext();
const CART_STORAGE_KEY = "cart";

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                return prevCart.map((item) =>
                item.id === product.id ? {...item, quantity: item.quantity + 1} : item );
            }
            return [...prevCart, { ...product, quantity: 1} ];
        });
        toast.success(`${product.title || product.name} added to cart!`);
    };


    const updateQuantity = (id, qty) => {
        if (qty < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
        );
    };
    const removeItem = (id) => {
        const removedItem = cart.find(item => item.id === id);
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        if (removedItem) {
            toast.success(`${removedItem.title || removedItem.name} removed from cart`);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem }}>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext);
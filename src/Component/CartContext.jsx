import { useContext } from "react";
import { createContext, useState } from "react";
import { toast } from "react-hot-toast";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

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
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem }}>
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => useContext(CartContext);
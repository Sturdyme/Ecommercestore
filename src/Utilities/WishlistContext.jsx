import { createContext, useContext, useState} from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children}) => {
    const [wishlist, setWishlist] = useState([]);


    const addToWishlist = (product) => {
        const exists = wishlist.some(item => item.id === product.id);
        if (exists) {
            toast.error("Product is already in your wishlist ❤️");
            return;
        }
        setWishlist((prev) => [...prev, product]);
        toast.success("Added to wishlist ❤️");
    };

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        toast.success("Removed from wishlist");
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
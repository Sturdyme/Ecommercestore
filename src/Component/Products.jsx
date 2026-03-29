import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import { useCart } from "./CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const fetchProduct = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchProduct();
  }, []);

  const limitedProducts = products.slice(0, 10);

  if (!products.length) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <section
      data-aos="fade-up"
      className="grid gap-6 mt-14 px-4 
                 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {limitedProducts.map((p) => (
        <article
          key={p.id}
          className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 
                     rounded-2xl overflow-hidden shadow-sm hover:shadow-xl 
                     transition-all duration-300 flex flex-col"
        >
          
          {/* Image */}
          <div className="bg-gray-100 dark:bg-gray-800 h-44 flex items-center justify-center p-3">
            <img
              src={p.images[0]}
              alt={p.title}
              loading="lazy"
              className="h-full object-contain group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 space-y-2">
            
            {/* Title */}
            <h3 className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-2">
              {p.title}
            </h3>

            {/* Brand */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {p.brand}
            </p>

            {/* Bottom Section */}
            <div className="mt-auto space-y-3">
              
              {/* Price + Rating + Stock */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-green-600">
                  ${p.price}
                </span>

                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                  ⭐ {p.rating}
                </span>

                <span className="text-xs text-gray-400">
                  {p.stock} left
                </span>
              </div>

              {/* Button */}
              <button 
                onClick={() => addToCart({...p, image: p.images[0]})}
                className="w-full bg-purple-500 text-white text-sm py-2 rounded-lg font-medium 
                                 hover:bg-purple-600 active:scale-95 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default Products;
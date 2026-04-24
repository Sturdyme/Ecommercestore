import { useEffect, useState } from "react";
import { usdToNairaDisplay } from "../Utilities/currency";
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
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-500">Loading YossyVogue Collection...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Curated fashion just for you.</p>
        </div>
      </div>

      {/* Responsive Grid System */}
      <div
        data-aos="fade-up"
        className="grid gap-4 sm:gap-6 
                   grid-cols-2          /* 1 card on very small phones */
                   xs:grid-cols-2       /* 2 cards on standard phones */
                   md:grid-cols-3       /* 3 cards on tablets */
                   lg:grid-cols-4       /* 4 cards on laptops */
                   xl:grid-cols-5"      /* 5 cards on large desktops */
      >
        {limitedProducts.map((p) => (
          <article
            key={p.id}
            className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 
                       rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1
                       transition-all duration-300 flex flex-col h-full"
          >
            
            {/* Image Container - Responsive Height */}
            <div className="bg-gray-50 dark:bg-gray-800 aspect-square overflow-hidden relative">
              <img
                src={p.images[0]}
                alt={p.title}
                loading="lazy"
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition duration-500"
              />
              {/* Floating Badge for Mobile */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                 <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm text-yellow-600 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold">
                    ⭐ {p.rating}
                 </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              <div className="mb-1">
                <p className="text-[10px] tracking-wider text-gray-400 font-bold uppercase">
                  {p.brand || "Exclusive"}
                </p>
                <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white line-clamp-1">
                  {p.title}
                </h3>
              </div>

              {/* Price & Stock Section */}
              <div className="mt-2 flex items-center justify-between">
                <p className="font-black text-purple-600 text-sm sm:text-base">
                  {usdToNairaDisplay(p.price)}
                </p>
                <p className="text-[10px] text-gray-400 italic">
                  {p.stock} units left
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button 
                  onClick={() => addToCart({...p, image: p.images[0]})}
                  className="w-full bg-gray-900 dark:bg-purple-600 text-white text-xs sm:text-sm py-2.5 
                             rounded-xl font-bold hover:bg-purple-700 active:scale-95 transition-all
                             flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Products;
import React from "react";
import { FaXmark } from "react-icons/fa6";
import { useCart } from "./CartContext";
import { usdToNairaDisplay } from "../Utilities/currency";

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        {/* IMAGE */}
        <img
          src={product.productImage}
          className="w-full h-80 md:h-full object-cover"
        />

        {/* DETAILS */}
        <div className="p-6 flex flex-col justify-between">
          
          <button
            onClick={onClose}
            className="self-end text-gray-500 hover:text-red-500"
          >
            <FaXmark size={22} />
          </button>

          <div>
            <h2 className="text-2xl text-black dark:text-white font-bold">
              {product.productName}
            </h2>

            <p className="text-black dark:text-white mt-2 text-sm">
              High quality Yuna collective product designed for durability and style.
            </p>

            <div className="mt-4 flex gap-3">
              <span className="text-purple-600 font-bold text-xl">
                {usdToNairaDisplay(product.newPrice)}
              </span>
              <span className="line-through text-gray-400">
                {usdToNairaDisplay(product.oldPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                title: product.productName,
                price: product.newPrice,
                image: product.productImage,
              })
            }
            className="bg-purple-600 text-white py-3 rounded-xl mt-6 hover:bg-purple-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
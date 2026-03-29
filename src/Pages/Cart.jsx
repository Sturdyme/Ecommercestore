import { useState } from "react";
import mug from "../assets/specialOfferImages/mug.png"
import chair from "../assets/specialOfferImages/chair.png"
import { useCart } from "../Component/CartContext";

const initialCart = [
  {
    id: 1,
    name: "Imported Chair",
    price: 120,
    quantity: 1,
    image: chair,
  },
  {
    id: 2,
    name: "Smart Cutlery Set",
    price: 180,
    quantity: 2,
    image: mug,
  },
];

export default function Cart() {
 const { cart, updateQuantity, removeItem} = useCart();

 const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
 const shipping = subtotal > 0 ? 20 : 0;
 const total = subtotal + shipping;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 md:p-10 flex-1">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 theme-text-black">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            {cart.length === 0 && (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="flex text-black dark:text-white items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 text-black dark:text-white rounded object-cover"
                />
                <div>
                  <h2 className="font-medium text-black dark:text-white">{item.title || item.name}</h2>
                  <p className="text-black dark:text-white">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                  className="w-16 border rounded px-2 py-1 text-center text-black dark:text-black
                  "
                />

                <p className="w-20 text-right font-medium text-black dark:text-white">
                  ${item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm dark:text-red-400 dark:hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          </div>

          {/* Right Side: Summary (Sticky) */}
          <div className="lg:col-span-1 sticky top-[140px]">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-black dark:text-white">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-black dark:text-white">Subtotal</span>
              <span className="text-black dark:text-white">${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-black dark:text-white">Shipping</span>
              <span className="text-black dark:text-white">${shipping}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-4">
              <span className="text-black dark:text-white">Total</span>
              <span className="text-black dark:text-white">${total}</span>
            </div>

            <button
              className="w-full mt-6 bg-black text-white dark:text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import mug from "../assets/specialOfferImages/mug.png"
import chair from "../assets/specialOfferImages/chair.png"

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
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: qty } : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 20 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

        {/* Cart Items */}
        <div className="space-y-6">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          )}

          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-gray-500">${item.price}</p>
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
                  className="w-16 border rounded px-2 py-1 text-center"
                />

                <p className="w-20 text-right font-medium">
                  ${item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-sm bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-4">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <button
              className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

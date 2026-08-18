import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaStore, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { convertToNaira } from "../Utilities/currency";
import { useCart } from "./CartContext";

const PICKUP_LOCATION = {
  name: "YossyVogue Flagship Store",
  address: "No 17 Yemi Alimi Street, Ikorodu, Lagos",
  hours: "Mon–Sat, 9am–6pm",
};

const formatNaira = (amount) => {
  const parts = amount
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    .split(".");
  return `₦${parts[0]}.${parts[1]}`;
};

/**
 * Order review / summary page.
 * Shows the cart, lets the user choose Pickup vs Delivery, then calls
 * onContinue(fulfillmentMethod) so the parent can route to Checkout with
 * that choice — Checkout uses it to decide whether to apply shipping.
 */
const OrderReview = () => {
  const navigate = useNavigate();
  const { cart: cartItems } = useCart();
  const [fulfillmentMethod, setFulfillmentMethod] = useState("delivery"); // 'delivery' | 'pickup'

  // Pull the address the user saved in Account Settings (see Profile.jsx)
  const storedUser = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw && raw !== "undefined" ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();
  const userAddress = storedUser.address || null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + convertToNaira(Number(item.price)) * item.quantity,
    0
  );

  const shipping = fulfillmentMethod === "delivery" ? subtotal * 0.15 : 0;
  const total = subtotal + shipping;

  const hasAddress =
    userAddress && (userAddress.line1 || userAddress.city || userAddress.state);

  const canContinue =
    cartItems.length > 0 && (fulfillmentMethod === "pickup" || hasAddress);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black px-4 py-8">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Order Review
        </h2>

        {/* ITEMIZED CART LIST */}
        <div className="space-y-3">
          {cartItems.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          )}
          {cartItems.map((item, index) => {
            const linePrice = convertToNaira(Number(item.price)) * item.quantity;
            return (
              <div
                key={item.id ?? index}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {item.name || item.title || "Product"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-white shrink-0">
                  {formatNaira(linePrice)}
                </span>
              </div>
            );
          })}
        </div>

        {/* FULFILLMENT METHOD SELECTION */}
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            How would you like to receive your order?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFulfillmentMethod("delivery")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                fulfillmentMethod === "delivery"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <FaTruck
                className={`text-xl mt-0.5 shrink-0 ${
                  fulfillmentMethod === "delivery"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400"
                }`}
              />
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Delivery
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Delivered to your address. Shipping fee applies.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFulfillmentMethod("pickup")}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                fulfillmentMethod === "pickup"
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <FaStore
                className={`text-xl mt-0.5 shrink-0 ${
                  fulfillmentMethod === "pickup"
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400"
                }`}
              />
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Store Pickup
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Free. Pick up in person, no shipping fee.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* CONTEXTUAL DETAIL: address for delivery, store info for pickup */}
        {fulfillmentMethod === "delivery" && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="text-purple-600 dark:text-purple-400 text-sm" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                Delivery address
              </span>
            </div>
            {hasAddress ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {userAddress.line1}, {userAddress.city}, {userAddress.state}
                {userAddress.country ? `, ${userAddress.country}` : ""}
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                No delivery address on file. Please add one in Account Settings before continuing.
              </p>
            )}
          </div>
        )}

        {fulfillmentMethod === "pickup" && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <FaStore className="text-purple-600 dark:text-purple-400 text-sm" />
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {PICKUP_LOCATION.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {PICKUP_LOCATION.address}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {PICKUP_LOCATION.hours}
            </p>
          </div>
        )}

        {/* ORDER TOTALS */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Items Subtotal</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {formatNaira(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {fulfillmentMethod === "delivery" ? "Shipping" : "Shipping"}
            </span>
            <span className="font-medium text-gray-800 dark:text-white">
              {fulfillmentMethod === "delivery" ? formatNaira(shipping) : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-purple-600 dark:text-purple-400">
              {formatNaira(total)}
            </span>
          </div>
        </div>

        {/* CONTINUE */}
        <button
          onClick={() =>
            navigate("/checkout", { state: { cartItems, fulfillmentMethod } })
          }
          disabled={!canContinue}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-purple-200 dark:shadow-none flex items-center justify-center gap-2"
        >
          Continue to Payment <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default OrderReview;

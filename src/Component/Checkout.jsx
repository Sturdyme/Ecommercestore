import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCreditCard, FaLock } from "react-icons/fa";
import api from "../api";
import { convertToNaira } from "../Utilities/currency";

const Checkout = ({ cartItems: cartItemsProp, fulfillmentMethod: fulfillmentMethodProp }) => {
  const location = useLocation();
  // Prefer whatever OrderReview navigated here with; fall back to props
  // (e.g. if Checkout is ever rendered directly, or during local testing).
  const cartItems = location.state?.cartItems ?? cartItemsProp ?? [];
  const fulfillmentMethod = location.state?.fulfillmentMethod ?? fulfillmentMethodProp ?? "delivery";

  const [loading, setLoading] = useState(false);

  // 1. Convert all item prices to Naira and calculate subtotal
  const calculatedSubtotal = cartItems.reduce(
    (acc, item) => acc + convertToNaira(Number(item.price)) * item.quantity,
    0
  );

  // 2. Shipping is 15% of subtotal for delivery, free for pickup
  const calculatedShipping =
    fulfillmentMethod === "delivery" ? calculatedSubtotal * 0.15 : 0;

  // 3. Grand total
  const calculatedTotal = calculatedSubtotal + calculatedShipping;

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 4. Ensure the amount is a clean integer (Naira) before sending
      const amountToSend = Math.round(calculatedTotal);

      // Safety check for empty carts
      if (!amountToSend && fulfillmentMethod !== "pickup") {
        alert("Your cart is empty. Please add products before checking out.");
        setLoading(false);
        return;
      }
      if (cartItems.length === 0) {
        alert("Your cart is empty. Please add products before checking out.");
        setLoading(false);
        return;
      }

      const response = await api.post(
        "/pay",
        {
          amount: amountToSend,
          fulfillment_method: fulfillmentMethod,
          items: cartItems.map((item) => ({
            ...item,
            price: convertToNaira(Number(item.price)),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { authorization_url } = response.data;

      if (authorization_url) {
        // Redirect to Paystack Test/Live page
        window.location.href = authorization_url;
      }
    } catch (error) {
      const resp = error.response || {};
      const respData = resp.data;
      console.error("Payment failed:", {
        status: resp.status,
        data: respData,
        message: error.message,
        stack: error.stack,
      });

      const safeDataString = (() => {
        try {
          return typeof respData === "string" ? respData : JSON.stringify(respData);
        } catch (e) {
          return String(respData);
        }
      })();

      const errorMsg =
        (respData && (respData.message || safeDataString)) ||
        error.message ||
        "Payment could not be initiated. Try again.";

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Helper for Naira formatting: comma as thousands separator, dot as decimal separator (kobo)
  const formatNaira = (amount) => {
    const parts = amount
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .split(".");
    return `₦${parts[0]}.${parts[1]}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Checkout
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaLock />
            <span>Secure SSL</span>
          </div>
        </div>

        {/* Fulfillment method reminder */}
        <div className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
          {fulfillmentMethod === "pickup" ? "Store Pickup" : "Delivery"}
        </div>

        {/* Order Summary Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Items Subtotal</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {formatNaira(calculatedSubtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {fulfillmentMethod === "delivery" ? "Shipping (15%)" : "Shipping"}
            </span>
            <span className="font-medium text-gray-800 dark:text-white">
              {fulfillmentMethod === "delivery" ? formatNaira(calculatedShipping) : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-purple-600 dark:text-purple-400">
              {formatNaira(calculatedTotal)}
            </span>
          </div>
        </div>

        {/* Payment Method UI */}
        <div className="border rounded-xl p-4 flex items-center justify-between bg-purple-50 dark:bg-gray-700 border-purple-100 dark:border-purple-900">
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-purple-600 dark:text-purple-400 text-2xl" />
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">Paystack</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Card • Transfer • Bank
              </p>
            </div>
          </div>
          <span className="text-purple-600 dark:text-purple-400 text-xs font-bold italic">
            Active
          </span>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || calculatedTotal < 0 || cartItems.length === 0}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-purple-200 dark:shadow-none"
        >
          {loading ? "Initializing..." : `Pay ${formatNaira(calculatedTotal)}`}
        </button>

        {/* Footer */}
        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
         Verified by Paystack Gateway
        </p>
      </div>
    </div>
  );
};

export default Checkout;

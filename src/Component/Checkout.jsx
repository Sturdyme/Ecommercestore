import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaLock, FaWallet, FaCheckCircle } from "react-icons/fa";
import api from "../api";
import { formatNaira as formatCurrency } from "../Utilities/currency";

const Checkout = ({ cartItems: cartItemsProp, fulfillmentMethod: fulfillmentMethodProp }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems ?? cartItemsProp ?? [];
  const fulfillmentMethod = location.state?.fulfillmentMethod ?? fulfillmentMethodProp ?? "delivery";

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack"); // 'paystack' | 'wallet'
  const [walletBalance, setWalletBalance] = useState(0);
  const [fetchingWallet, setFetchingWallet] = useState(true);

  const calculatedSubtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const calculatedShipping =
    fulfillmentMethod === "delivery" ? calculatedSubtotal * 0.15 : 0;

  const calculatedTotal = calculatedSubtotal + calculatedShipping;

  // Fetch wallet balance so we can show it and validate before allowing wallet payment
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get("/wallet", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setWalletBalance(res.data.wallet?.balance ?? res.data.balance ?? 0);
      } catch (err) {
        console.error("Failed to fetch wallet balance", err);
      } finally {
        setFetchingWallet(false);
      }
    };
    fetchWallet();
  }, []);

  const hasEnoughBalance = Number(walletBalance) >= calculatedTotal;

  const handlePaystackPayment = async () => {
    const amountToSend = Math.round(calculatedTotal);

    const response = await api.post(
      "/pay",
      {
        amount: amountToSend,
        fulfillment_method: fulfillmentMethod,
        items: cartItems.map((item) => ({
          ...item,
          price: Number(item.price),
        })),
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const { authorization_url } = response.data;
    if (authorization_url) {
      window.location.href = authorization_url;
    }
  };

  const handleWalletPayment = async () => {
    const response = await api.post(
      "/wallet/pay",
      {
        fulfillment_method: fulfillmentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id || item.product_id,
          name: item.name || item.title,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // No external redirect needed — payment is instant, go straight to a success view
    navigate("/payment-success", {
      state: { order: response.data.order, method: "wallet" },
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (cartItems.length === 0) {
        alert("Your cart is empty. Please add products before checking out.");
        setLoading(false);
        return;
      }

      if (paymentMethod === "wallet") {
        if (!hasEnoughBalance) {
          alert("Insufficient wallet balance for this order.");
          setLoading(false);
          return;
        }
        await handleWalletPayment();
      } else {
        await handlePaystackPayment();
      }
    } catch (error) {
      const resp = error.response || {};
      const respData = resp.data;
      console.error("Payment failed:", {
        status: resp.status,
        data: respData,
        message: error.message,
      });

      const errorMsg =
        (respData && respData.message) ||
        error.message ||
        "Payment could not be completed. Try again.";

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Checkout
          </h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FaLock />
            <span>Secure SSL</span>
          </div>
        </div>

        <div className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
          {fulfillmentMethod === "pickup" ? "Store Pickup" : "Delivery"}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Items Subtotal</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {formatCurrency(calculatedSubtotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {fulfillmentMethod === "delivery" ? "Shipping (15%)" : "Shipping"}
            </span>
            <span className="font-medium text-gray-800 dark:text-white">
              {fulfillmentMethod === "delivery" ? formatCurrency(calculatedShipping) : "Free"}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-purple-600 dark:text-purple-400">
              {formatCurrency(calculatedTotal)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Choose Payment Method
          </label>

          {/* Paystack Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("paystack")}
            className={`w-full border rounded-xl p-4 flex items-center justify-between transition-all ${
              paymentMethod === "paystack"
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-2 ring-purple-500/20"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaCreditCard className="text-purple-600 dark:text-purple-400 text-2xl" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white text-sm">Paystack</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Card • Transfer • Bank
                </p>
              </div>
            </div>
            {paymentMethod === "paystack" && (
              <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
            )}
          </button>

          {/* Wallet Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod("wallet")}
            disabled={!hasEnoughBalance || fetchingWallet}
            className={`w-full border rounded-xl p-4 flex items-center justify-between transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              paymentMethod === "wallet"
                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-2 ring-purple-500/20"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaWallet className="text-purple-600 dark:text-purple-400 text-2xl" />
              <div className="text-left">
                <p className="font-medium text-gray-800 dark:text-white text-sm">Wallet Balance</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {fetchingWallet
                    ? "Loading balance..."
                    : hasEnoughBalance
                    ? `Available: ${formatCurrency(Number(walletBalance))}`
                    : `Insufficient — you have ${formatCurrency(Number(walletBalance))}`}
                </p>
              </div>
            </div>
            {paymentMethod === "wallet" && (
              <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
            )}
          </button>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || calculatedTotal < 0 || cartItems.length === 0}
          className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-purple-200 dark:shadow-none"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "wallet"
            ? `Pay with Wallet — ${formatCurrency(calculatedTotal)}`
            : `Pay ${formatCurrency(calculatedTotal)}`}
        </button>

        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
          {paymentMethod === "wallet" ? "Instant Wallet Debit" : "Verified by Paystack Gateway"}
        </p>
      </div>
    </div>
  );
};

export default Checkout;
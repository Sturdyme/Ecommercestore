import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaWallet, FaArrowRight } from "react-icons/fa";

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'failed'
  const [message, setMessage] = useState("Verifying payment with Paystack...");
  const [transaction, setTransaction] = useState(null);
  const isVerifying = useRef(false);

  useEffect(() => {
    // Get reference from URL parameters (Paystack sends reference or trxref)
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("failed");
      setMessage("Invalid payment reference. No reference supplied.");
      return;
    }

    // Prevent double verification on component remounts in React Strict Mode
    if (isVerifying.current) return;
    isVerifying.current = true;

    const verifyTransaction = async () => {
      try {
        const token = localStorage.getItem("token");

        // Backend Endpoint to verify Paystack Transaction
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet/verify/${reference}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();

        if (res.ok && (data.status === "success" || data.status === true)) {
          setStatus("success");
          setMessage(data.message || "Wallet funded successfully!");
          setTransaction(data.transaction || data.data);

          // Trigger event so Navbar automatically re-fetches wallet balance
          window.dispatchEvent(new Event("walletUpdated"));
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment verification failed or pending.");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatus("failed");
        setMessage("Network error occurred while verifying payment.");
      }
    };

    verifyTransaction();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 text-center space-y-6">
        
        {/* Loading State */}
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
              <FaSpinner className="text-3xl animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirming Payment</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-50 dark:bg-green-900/30 text-green-500 rounded-2xl flex items-center justify-center">
              <FaCheckCircle className="text-3xl" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Payment Successful!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>

            {transaction && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-left text-xs space-y-2 border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Reference:</span>
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-200">{transaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount Funded:</span>
                  <span className="font-bold text-green-500 text-sm">
                    ₦{Number(transaction.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => navigate("/wallet")}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FaWallet /> Back to Wallet
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
              >
                Continue Shopping <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center">
              <FaTimesCircle className="text-3xl" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="text-sm text-red-500 dark:text-red-400 font-medium">{message}</p>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => navigate("/wallet")}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaystackCallback;
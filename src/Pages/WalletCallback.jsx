// src/Pages/WalletCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

const WalletCallback = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("verifying");
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!reference) {
        setStatus("failed");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wallet/verify/${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransaction(res.data.transaction);
        setStatus("success");
        window.dispatchEvent(new Event("walletUpdated")); // refreshes Navbar's wallet balance
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        {status === "verifying" && <p>Verifying your payment...</p>}

        {status === "success" && (
          <>
            <p className="text-2xl mb-2">✅</p>
            <h2 className="text-xl font-black dark:text-white mb-1">Wallet Funded!</h2>
            <p className="text-sm text-gray-500 mb-6">
              ₦{Number(transaction?.amount || 0).toLocaleString()} added to your wallet.
            </p>
            <Link to="/wallet" className="text-purple-600 font-bold text-sm">
              Go to Wallet →
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <p className="text-2xl mb-2">❌</p>
            <h2 className="text-xl font-black dark:text-white mb-1">Payment Failed</h2>
            <p className="text-sm text-gray-500 mb-6">We couldn't verify this payment.</p>
            <Link to="/wallet" className="text-purple-600 font-bold text-sm">
              Back to Wallet →
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletCallback;
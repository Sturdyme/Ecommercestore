import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaWallet, 
  FaCreditCard, 
  FaUniversity, 
  FaArrowLeft, 
  FaLock, 
  FaCheckCircle, 
  FaHistory 
} from "react-icons/fa";

const AddMoneyModal = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("paystack");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState({ balance: 0.00 });
  const [transactions, setTransactions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const quickAmounts = [1000, 2000, 5000, 10000, 20000];

  // Fetch Current Wallet Info & History
  const fetchWalletData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setFetching(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet || data);
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load wallet data", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Handle Paystack Deposit Trigger
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < 100) {
      setErrorMsg("Minimum top-up amount is ₦100.");
      return;
    }

    if (selectedMethod !== "paystack") {
      setErrorMsg("Selected payment method is currently undergoing maintenance.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // ================================================================
      // PAYSTACK API INTEGRATION CALL
      // ================================================================
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet/top-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
        }),
      });

      const data = await res.json();

      if (res.ok && data.authorization_url) {
        // Redirect user to Paystack Payment Page
        window.location.href = data.authorization_url;
      } else {
        setErrorMsg(data.message || "Failed to initialize payment.");
      }
    } catch (err) {
      console.error("Payment initialization error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white"> Wallet</h1>
        </div>

        {/* Balance Overview Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-purple-200 font-semibold mb-1">
                Available Wallet Balance
              </p>
              <h2 className="text-3xl sm:text-4xl font-black">
                {fetching ? (
                  <span className="text-purple-200 text-2xl">Loading balance...</span>
                ) : (
                  `₦${Number(wallet.balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
                )}
              </h2>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center gap-3">
              <FaWallet className="text-2xl text-purple-200" />
              <div className="text-right">
                <p className="text-[10px] text-purple-200 uppercase font-bold">Currency</p>
                <p className="text-xs font-bold">NGN (₦)</p>
              </div>
            </div>
          </div>
          {/* Decorative background shapes */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Add Money Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fund Your Wallet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Select or enter an amount to deposit into your account instantly.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* Quick Amount Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Quick Select Amount
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        amount === amt.toString()
                          ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300"
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Enter Custom Amount (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-lg">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="100"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Choose Deposit Gateway
                </label>
                <div className="space-y-3">
                  
                  {/* Option 1: Paystack */}
                  <label
                    onClick={() => setSelectedMethod("paystack")}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedMethod === "paystack"
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/10 ring-2 ring-purple-500/20"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500 text-white rounded-xl">
                        <FaCreditCard className="text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Debit / Credit Card & Bank Transfer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Powered by Paystack (Instant credit)
                        </p>
                      </div>
                    </div>
                    {selectedMethod === "paystack" && (
                      <FaCheckCircle className="text-purple-600 text-lg" />
                    )}
                  </label>

                  {/* Option 2: Direct Bank Transfer (Disabled / Optional) */}
                  <label
                    onClick={() => setSelectedMethod("bank_transfer")}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer opacity-60 transition-all ${
                      selectedMethod === "bank_transfer"
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-600 text-white rounded-xl">
                        <FaUniversity className="text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Manual Wire Transfer
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Takes up to 24 hours to process
                        </p>
                      </div>
                    </div>
                    {selectedMethod === "bank_transfer" && (
                      <FaCheckCircle className="text-purple-600 text-lg" />
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Connecting to Paystack...</span>
                ) : (
                  <>
                    <FaLock className="text-xs" />
                    <span>Proceed to Pay ₦{amount ? Number(amount).toLocaleString() : "0.00"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Sidebar: Recent Transactions */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <FaHistory className="text-purple-500" />
              <h3 className="text-md font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] pr-1">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id || tx.reference}
                    className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                        {tx.type || "Transaction"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-black ${
                        tx.type === "credit" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}₦{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-8">
                  No recent wallet transactions.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
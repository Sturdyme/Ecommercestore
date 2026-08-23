import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaWallet, 
  FaArrowLeft, 
  FaArrowDown, 
  FaSearch, 
  FaCalendarAlt, 
  FaExchangeAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";

const Payments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({ balance: 0.00 });
  const [deposits, setDeposits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPaymentsHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet || data);
        
        // Filter only deposit/credit transactions
        const allTransactions = data.transactions || [];
        const walletDeposits = allTransactions.filter(
          (tx) => tx.type === "credit" || tx.type === "deposit" || tx.amount > 0
        );
        setDeposits(walletDeposits);
      }
    } catch (err) {
      console.error("Failed to fetch payment history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsHistory();
  }, []);

  // Filtered Deposits based on Search & Status
  const filteredDeposits = deposits.filter((item) => {
    const matchesSearch = 
      (item.reference && item.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Total Deposits Calculation
  const totalDeposited = deposits
    .filter(d => d.status === "success" || !d.status)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
            <FaCheckCircle className="text-[10px]" /> Successful
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <FaClock className="text-[10px]" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
            <FaTimesCircle className="text-[10px]" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-2"
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Payment & Deposit History</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              View all top-ups, deposits, and payment transactions added to your account.
            </p>
          </div>

          <button
            onClick={() => navigate("/wallet")}
            className="self-start sm:self-auto px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 text-sm"
          >
            <FaWallet /> Deposit Funds
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Wallet Balance</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                ₦{Number(wallet.balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
              <FaWallet className="text-2xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount Deposited</p>
              <h2 className="text-2xl sm:text-3xl font-black text-green-600 dark:text-green-400">
                ₦{totalDeposited.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl">
              <FaArrowDown className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by reference or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {["all", "success", "pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border ${
                  statusFilter === filter
                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Payment History Table / List */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold text-gray-400 animate-pulse">
              Loading deposit records...
            </div>
          ) : filteredDeposits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Transaction Detail</th>
                    <th className="py-4 px-6">Reference</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {filteredDeposits.map((item, idx) => (
                    <tr key={item.id || item.reference || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-xl">
                            <FaArrowDown />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {item.description || "Wallet Top-up"}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {item.gateway || "Paystack"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-gray-500 dark:text-gray-400">
                        {item.reference || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-[10px] text-gray-400" />
                          {new Date(item.created_at || Date.now()).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(item.status || "success")}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-green-600 dark:text-green-400 text-sm">
                        +₦{Number(item.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl flex items-center justify-center">
                <FaExchangeAlt />
              </div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No deposit history found</p>
              <p className="text-xs text-gray-400">You haven't made any wallet top-ups matching your criteria.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Payments;
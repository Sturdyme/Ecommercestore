// src/Pages/Admin/ManageUsers.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ShieldCheck,
  UserCheck,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  User,
  Calendar,
  Mail,
  Lock,
} from "lucide-react";

const ROLE_OPTIONS = ["customer", "admin"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const currentUserId = JSON.parse(localStorage.getItem("user") || "null")?.id;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const confirmed = window.confirm(
      newRole === "admin"
        ? "Grant administrative access to this user?"
        : "Revoke admin privileges from this user?"
    );
    if (!confirmed) return;

    setUpdatingId(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: res.data.role } : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter Users locally by search query and selected role
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Role summary stats
  const adminCount = useMemo(() => users.filter((u) => u.role === "admin").length, [users]);
  const customerCount = useMemo(() => users.filter((u) => u.role === "customer").length, [users]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading user directory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 font-sans">
      {/* Top Header & Navigation Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            User Management
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {users.length} Users
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Assign user access permissions, control roles, and review accounts
          </p>
        </div>

        <div className="flex gap-3 text-xs font-bold">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
          >
            Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition"
          >
            Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Summary Stat Pills & Search Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              roleFilter === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("admin")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              roleFilter === "admin"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Admins ({adminCount})
          </button>
          <button
            onClick={() => setRoleFilter("customer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              roleFilter === "customer"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Customers ({customerCount})
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* User Directory List */}
      {filteredUsers.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="font-bold text-sm text-gray-700 dark:text-gray-300">No matching users</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or role filters.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((u) => {
              const isCurrentUser = u.id === currentUserId;
              const isAdmin = u.role === "admin";

              return (
                <motion.div
                  key={u.id}
                  layout
                  variants={itemVariants}
                  whileHover={{ y: -1 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                >
                  {/* User Profile Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar Initials */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 ring-1 ring-purple-500/20"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 ring-1 ring-indigo-500/20"
                      }`}
                    >
                      {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                          {u.name}
                        </p>

                        {/* Role Badge */}
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60"
                              : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }`}
                        >
                          {isAdmin && <ShieldCheck className="w-2.5 h-2.5" />}
                          {u.role}
                        </span>

                        {/* Current User Label */}
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {u.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          Joined {new Date(u.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Selector Control */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isCurrentUser ? (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800 font-medium">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <div className="relative">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={updatingId === u.id}
                          className="appearance-none text-xs font-semibold border rounded-xl px-3 py-1.5 pr-7 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition cursor-pointer"
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              Set as {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                          ))}
                        </select>
                        {updatingId === u.id ? (
                          <RefreshCw className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-indigo-500 animate-spin pointer-events-none" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ManageUsers;
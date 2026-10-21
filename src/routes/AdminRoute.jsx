import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../Component/AuthContext";

const CheckingAccess = () => (
  <div className="flex min-h-[60vh] flex-1 items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-gray-700 dark:border-t-purple-400" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checking access...</p>
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="flex min-h-[60vh] flex-1 items-center justify-center px-4 py-16">
    <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-purple-500/5 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-black tracking-tight text-gray-900 dark:text-white">
        Admins only
      </h1>
      <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
        This area is restricted to store administrators. If you think you should have access,
        contact the store owner.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 motion-reduce:transform-none"
      >
        Back to the store
      </Link>
    </div>
  </div>
);

// The role comes from the backend-confirmed user in AuthContext,
// never from a value stored in the browser.
const AdminRoute = ({ children }) => {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === "loading") return <CheckingAccess />;

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") return <AccessDenied />;

  return children;
};

export default AdminRoute;

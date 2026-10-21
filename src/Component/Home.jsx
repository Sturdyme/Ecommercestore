
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShoppingBag, FiPackage, FiShield } from "react-icons/fi";

import Navbar from "./Navbar";
import Slideprops from "./Slideprops";
import Trending from "./Trending";
import Products from "./Products";
import Shopping from "./Shopping";
import SpecialOfferSection from "./SpecialOfferSection";
import FeaturedProducts from "./FeaturedProducts";
import FeaturedSection from "./FeaturedSection";
import SignUpOffers from "./SignUpOffers";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Check login status and listen for login/logout events.
  useEffect(() => {
    const readStoredUser = () => {
      try {
        const stored = localStorage.getItem("user");

        if (stored && stored !== "undefined") {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to parse stored user in Home:", error);
      }

      return null;
    };

    const token = localStorage.getItem("token");
    const userData = readStoredUser();

    setIsLoggedIn(Boolean(token));
    setUser(userData);

    const handleUserLogin = (event) => {
      const loginData = event?.detail || readStoredUser();

      setUser(loginData);
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    const handleUserLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
    };

    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userLogout", handleUserLogout);

    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userLogout", handleUserLogout);
    };
  }, []);

  // Prevent a page refresh from restoring the Featured Section anchor.
  useEffect(() => {
    const navigationEntry = performance
      .getEntriesByType("navigation")[0];

    const isPageRefresh = navigationEntry?.type === "reload";

    if (isPageRefresh && window.location.hash === "#featuredsection") {
      const cleanUrl =
        window.location.pathname + window.location.search;

      window.history.replaceState(null, "", cleanUrl);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "there";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white">

      {/* Navigation */}
      <Navbar />

      {/* Main hero / slider */}
      <main>
        <section className="relative isolate">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-950 dark:to-transparent" />

          <Slideprops />
        </section>

     

        {/* Trending products */}
        <section className="relative py-8 md:py-12">
          <Trending />
        </section>

        {/* Main product collection */}
        <section className="relative py-8 md:py-12">
          <Products />
        </section>

        {/* Shopping categories / shopping experience */}
        <section className="relative py-8 md:py-12">
          <Shopping />
        </section>

        {/* Special offers */}
        <section className="relative py-8 md:py-12">
          <SpecialOfferSection />
        </section>

        {/* Featured products */}
        <section className="relative py-8 md:py-12">
          <FeaturedProducts />
        </section>

        {/* Featured collection */}
        <section
          id="featuredsection"
          className="relative scroll-mt-24 border-t border-zinc-200 bg-zinc-50 py-10 dark:border-zinc-800 dark:bg-zinc-950 md:py-16"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent dark:from-black dark:to-transparent" />

          <div className="relative">
            <FeaturedSection />
          </div>
        </section>

        {/* Dashboard banner for logged-in users */}
        {isLoggedIn && (
          <section className="relative overflow-hidden bg-zinc-950 py-14 text-white dark:bg-black md:py-20">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-purple-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-sm sm:p-10 md:flex-row md:items-center md:p-12">
                <div className="max-w-2xl">
                  <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200">
                    <span className="h-2 w-2 rounded-full bg-purple-400" />
                    Your YunaVogue account
                  </span>

                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                      {firstName}
                    </span>
                    !
                  </h2>

                  <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                    Your next great find is waiting. Manage your profile,
                    track your orders and keep your shopping experience
                    organized in one place.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 font-bold text-black transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    Go to Dashboard
                    <FiArrowRight className="text-lg" />
                  </button>
                </div>

                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-6 sm:p-8">
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-400">
                        Account overview
                      </p>
                      <h3 className="mt-1 text-xl font-bold">
                        Your dashboard
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                      <FiShoppingBag size={23} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-4">
                      <span className="text-sm text-zinc-300">
                        Account status
                      </span>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Logged in
                      </span>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-4">
                      <p className="text-sm text-zinc-400">Signed in as</p>
                      <p className="mt-1 break-words font-semibold">
                        {user?.email || user?.name || "YunaVogue customer"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Signup offer for visitors who are not logged in */}
        {!isLoggedIn && (
          <section className="relative py-8 md:py-12">
            <SignUpOffers />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;

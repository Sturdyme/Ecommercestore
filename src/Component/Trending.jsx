import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";

const Trending = () => {
  return (
    <section className="mt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 px-5 py-4 text-white shadow-lg shadow-purple-500/20 sm:px-8"
      >
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

        {/* Title */}
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
            <Zap className="h-6 w-6 fill-yellow-300 text-yellow-300" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-3xl">
              Today's Deals
            </h1>
            <p className="hidden text-xs font-medium text-purple-100 sm:block">
              Limited-time offers. Grab them before they're gone.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/superdeals"
          className="group relative flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-purple-700 shadow-md transition-transform hover:scale-[1.03]"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
};

export default Trending;
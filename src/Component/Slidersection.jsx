import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const AUTOPLAY_MS = 3000;
const SWIPE_OFFSET = 80;
const SWIPE_VELOCITY = 500;

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
  },
  exit: (direction) => ({
    x: direction > 0 ? "-100%" : "100%",
  }),
};

const SliderSection = ({ sliders = [] }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const count = sliders.length;
  const index = count ? ((page % count) + count) % count : 0;

  const paginate = useCallback((dir) => {
    setPage(([currentPage]) => [currentPage + dir, dir]);
  }, []);

  const goTo = (i) => {
    if (i === index) return;

    setPage(([currentPage]) => [
      currentPage + (i - index),
      i > index ? 1 : -1,
    ]);
  };

  // Automatic slide rotation
  useEffect(() => {
    if (paused || count < 2) return;

    const timer = setTimeout(() => paginate(1), AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [page, paused, count, paginate]);

  // Touch and swipe navigation
  const handleDragEnd = (_, { offset, velocity }) => {
    if (
      offset.x < -SWIPE_OFFSET ||
      velocity.x < -SWIPE_VELOCITY
    ) {
      paginate(1);
    } else if (
      offset.x > SWIPE_OFFSET ||
      velocity.x > SWIPE_VELOCITY
    ) {
      paginate(-1);
    }

    setPaused(false);
  };

  // Ecommerce trust features
  const features = [
    {
      icon: TruckIcon,
      title: "Fast & Reliable Shipping",
      desc: "Convenient delivery for your orders",
      accent: "from-violet-500/15 to-purple-500/5",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Checkout",
      desc: "Shop with confidence and peace of mind",
      accent: "from-emerald-500/15 to-teal-500/5",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Dedicated Customer Support",
      desc: "We're here to help when you need us",
      accent: "from-blue-500/15 to-indigo-500/5",
    },
  ];

  const slide = sliders[index];

  return (
    <section className="relative w-full overflow-hidden bg-gray-50 py-8 transition-colors duration-300 dark:bg-gray-950 sm:py-12 lg:py-14">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 sm:space-y-10 sm:px-6 lg:px-8">
        {/* Hero slider */}
        {count > 0 && (
          <div
            className="group relative isolate h-[300px] overflow-hidden rounded-3xl border border-gray-200/80 bg-gray-200 shadow-xl shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 sm:h-[400px] md:h-[460px] lg:h-[510px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setPaused(false);
              }
            }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {
                    type: "spring",
                    stiffness: 300,
                    damping: 32,
                  },
                }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setPaused(true)}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
              >
                {/* Slide image */}
                <img
                  src={slide.image}
                  alt={slide.alt || slide.title || "Featured collection"}
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
                />

                {/* Image overlays */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                {/* Purple accent */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-purple-400 via-violet-600 to-fuchsia-500" />

                {/* Slide content */}
                <div className="absolute inset-0 flex items-end px-6 pb-16 pt-10 sm:px-10 sm:pb-20 md:px-14 lg:px-16">
                  <motion.div
                    key={`content-${page}`}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.12 }}
                    className="max-w-2xl"
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-white shadow-sm backdrop-blur-md sm:text-sm">
                      <SparklesIcon className="h-4 w-4 text-purple-300" />
                      <span>Discover the YunaVogue collection</span>
                    </div>

                    <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>

                    {slide.subtitle && (
                      <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-gray-200 drop-shadow sm:text-base sm:leading-7 md:text-lg">
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.button && (
                      <button
                        type="button"
                        onClick={() => {
                          if (slide.href) {
                            window.location.assign(slide.href);
                          }
                        }}
                        className="group/button mt-6 inline-flex items-center justify-center gap-3 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-xl hover:shadow-purple-950/30 active:translate-y-0 sm:px-6 sm:py-4"
                      >
                        <span>{slide.button}</span>
                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators — no arrow buttons */}
            {count > 1 && (
              <div className="absolute bottom-5 left-6 z-20 flex items-center gap-2 sm:bottom-7 sm:left-10 md:left-14 lg:left-16">
                {sliders.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      i === index
                        ? "w-8 bg-purple-400"
                        : "w-2 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}

                <span className="ml-2 text-xs font-semibold tracking-widest text-white/80">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </span>
              </div>
            )}

            {/* Autoplay status */}
            {count > 1 && (
              <div className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-md sm:flex">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    paused ? "bg-amber-400" : "bg-green-400"
                  }`}
                />
                {paused ? "Paused" : "Discover more"}
              </div>
            )}
          </div>
        )}

        {/* Trust feature cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.08,
                }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-950/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-500/30 dark:hover:shadow-black/20 sm:p-6"
              >
                <div
                  className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${feature.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-purple-700 ring-1 ring-purple-100 transition-transform duration-300 group-hover:scale-105 dark:text-purple-300 dark:ring-white/5 sm:h-14 sm:w-14`}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold leading-5 text-gray-900 dark:text-white sm:text-base">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SliderSection;

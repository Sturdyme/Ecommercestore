import React, { useState, useEffect, useCallback } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const AUTOPLAY_MS = 3000;
const SWIPE_OFFSET= 80;
const SWIPE_VELOCITY = 500;

const variants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

const SliderSection = ({ sliders = [] }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const count = sliders.length;
  const index = count ? ((page % count) + count) % count : 0;

  const paginate = useCallback(
    (dir) => setPage(([p]) => [p + dir, dir]),
    []
  );

  const goTo = (i) => {
    if (i === index) return;
    setPage(([p]) => [p + (i - index), i > index ? 1 : -1]);
  };

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [page, paused, count, paginate]);

  const handleDragEnd = (_, { offset, velocity }) =>  {
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
      paginate(1);
    } else if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      paginate(-1);
    }
    setPaused(false);
  };

  // E-commerce highlight features
  const features = [
    {
      icon: TruckIcon,
      title: "Fast & Free Shipping",
      desc: "On all local orders",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "24/7 Dedicated Support",
      desc: "We are here to help anytime",
    },
  ];

  const slide = sliders[index];

  return (
   <section className="w-full relative z-10 py-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

 {/* Slider */}
        {count > 0 && (
          <div
            className="relative h-[260px] sm:h-[380px] md:h-[440px] rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-slate-200 dark:bg-slate-800 select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 32 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setPaused(true)}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <img
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  draggable={false}
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                    {slide.title}
                  </h3>

                  {slide.subtitle && (
                    <p className="mt-2 text-sm sm:text-base text-gray-200 line-clamp-2 max-w-xl">
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.button && (
                    <button className="mt-4 self-start px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl shadow-md transition-colors duration-200 flex items-center gap-2">
                      <span>{slide.button}</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows */}
            {count > 1 && (
              <>
            

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {sliders.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-purple-500" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800 dark:text-white p-6 rounded-2xl shadow-sm border border-slate-100">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-black dark:text-white text-sm md:text-base">
                    {feature.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
};

export default SliderSection;
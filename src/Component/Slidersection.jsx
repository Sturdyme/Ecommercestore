import React from "react";
import {
  TruckIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const SliderSection = ({ sliders = [] }) => {
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

  return (
    <section className="w-full relative z-10 py-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* E-Commerce Trust Badges / Icons */}
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
                  <p className="text-xs md:text-sm text-slate-500">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Column Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sliders.slice(0, 3).map((slide, index) => (
            <div
              key={index}
              className="relative h-[380px] rounded-2xl overflow-hidden shadow-md group border border-slate-100"
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.alt || slide.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-left">
                <h3 className="text-xl font-bold text-white drop-shadow-md">
                  {slide.title}
                </h3>
                
                {slide.subtitle && (
                  <p className="mt-1 text-sm text-gray-200 line-clamp-2">
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
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SliderSection;
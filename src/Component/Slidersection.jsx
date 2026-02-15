import React, { useEffect, useState } from "react";

const Slidersection = ({ sliders }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  return (
    <section className="w-full relative z-10 h-[50vh] overflow-hidden ">
      {sliders.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700
            ${index === current ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
          style={{ pointerEvents: index === current ? "auto" : "none" }}
        >
          {/* Image layer */}
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay (opacity stays here) */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center theme-text-white bg-black/50">
            <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
            <p className="mt-2 text-lg md:text-xl">{slide.subtitle}</p>
            <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg">
              {slide.button}
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Slidersection;
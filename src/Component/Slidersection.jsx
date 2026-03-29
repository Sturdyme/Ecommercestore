import React, { useEffect, useState } from "react";

const SliderSection = ({ sliders }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  return (
    <section className="w-full relative z-10 h-[60vh] md:h-[60vh] overflow-hidden">
      {sliders.map((slide, index) => {
        // Determine slide position for animation
        let position = "translate-x-full opacity-0"; // default off-screen right
        if (index === current) position = "translate-x-0 opacity-100"; // active slide
        if (
          index === (current - 1 + sliders.length) % sliders.length
        ) position = "-translate-x-full opacity-0"; // slide out left

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${position}`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4 md:px-10">
              <h2 className="text-2xl md:text-2xl max-sm:text-sm font-bold text-white drop-shadow-lg transform transition-transform duration-1000 ease-out">
                {slide.title}
              </h2>
              <p className="mt-2 text-sm md:text-xl text-gray-200 drop-shadow-md">
                {slide.subtitle}
              </p>
              <button className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg font-medium transition duration-300">
                {slide.button}
              </button>
            </div>
          </div>
        );
      })}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {sliders.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300
              ${idx === current ? "bg-purple-600 scale-125" : "bg-gray-300 dark:bg-gray-500"}
            `}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default SliderSection;
import React from "react";
import founder from '../assets/Founderspic/founder.png'

const About = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-transparent bg-clip-text">
      About Yuna collective
    </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Redefining online shopping with style, trust, and convenience.
            Yuna collective is your one-stop ecommerce destination for quality products
            delivered with excellence.
          </p>
        </div>

        {/* BRAND STORY */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Our Story
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            Yuna collective was created with a vision to make online shopping simple,
            affordable, and reliable. We understand the needs of modern shoppers,
            and we bring together fashion, lifestyle, home essentials, and electronics
            in one seamless platform. Our goal is to deliver quality products with
            excellent customer service and fast delivery.
          </p>
        </section>

        {/* SERVICES */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Fashion & Lifestyle",
                desc: "Trendy clothing, accessories, and lifestyle essentials.",
              },
              {
                title: "Home & Kitchen",
                desc: "Quality home appliances and kitchen tools at great prices.",
              },
              {
                title: "Secure Shopping",
                desc: "Safe payments powered by Paystack with full encryption.",
              },
              {
                title: "Fast Delivery",
                desc: "Quick and reliable delivery across multiple locations.",
              },
              {
                title: "Customer Support",
                desc: "24/7 AI and human support for all your needs.",
              },
              {
                title: "Easy Returns",
                desc: "Hassle-free refund and return process within policy terms.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-purple-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Our Mission
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              To provide a seamless, trustworthy, and affordable shopping experience
              for customers worldwide while maintaining top-quality service.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Our Vision
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              To become one of Africa’s leading eCommerce platforms known for
              reliability, innovation, and customer satisfaction.
            </p>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Meet the Team
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

  {/* IMAGE CONTAINER */}
  <div className="h-72 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-700">

    <img
      src={founder}
      alt="Founder"
      className="w-full h-full object-cover object-top transition duration-500 hover:scale-105"
    />

    {/* OPTIONAL DARK OVERLAY (makes text pop if you add later) */}
    <div className="absolute inset-0 bg-black/10"></div>

  </div>

  {/* TEXT CONTENT */}
  <div className="p-6 text-center">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      Yossy Vogue (Founder & Owner)
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
      Visionary behind Yuna collective, focused on building a modern,
      customer-centered ecommerce experience.
    </p>
  </div>

</div>

            {/* MANAGER */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
               <div className="h-72 w-full relative overflow-hidden bg-gray-100 dark:bg-gray-700">

    <img
      src={founder}
      alt="Founder"
      className="w-full h-full object-cover object-top transition duration-500 hover:scale-105"
    />

    {/* OPTIONAL DARK OVERLAY (makes text pop if you add later) */}
    <div className="absolute inset-0 bg-black/10"></div>

  </div>

  {/* TEXT CONTENT */}
  <div className="p-6 text-center">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      Yossy Vogue (Founder & Owner)
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
      Visionary behind Yuna collective, focused on building a modern,
      customer-centered ecommerce experience.
    </p>
  </div>

            </div>

          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-12">
          © {new Date().getFullYear()} Yuna collective. All rights reserved.
        </div>

      </div>
    </div>
  );
};

export default About;
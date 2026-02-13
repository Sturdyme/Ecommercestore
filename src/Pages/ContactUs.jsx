import React from "react";
import teamPic from "../assets/SupportTeamPic/teamPic.png";
import { FaPaperPlane } from "react-icons/fa";
import ContactHeroSection from "../Component/ContactHeroSection";
import ContactForm from "../Component/ContactForm";

const ContactUs = () => {
  return (
    <section>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-auto md:h-[500px] shadow-md overflow-hidden">

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <img
            src={teamPic}
            alt="support-team"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Purple Content Section */}
        <div className="w-full md:w-1/2 bg-purple-500 flex items-start md:items-center">
          <div className="px-8 sm:px-12 md:px-16 py-8 md:py-0 mt-8 md:mt-0">
            
            {/* Heading */}
            <p className="text-xl sm:text-2xl font-thin text-white">
              We are Here To Help
            </p>

            <p className="text-2xl sm:text-4xl mt-3 text-white font-semibold">
              Have A Question About YossyVogue?
            </p>

            <p className="text-white mt-3 text-sm sm:text-base">
              Can’t find what you are looking for? We’ll do our very best to help you.
            </p>

            {/* Button */}
            <div className="mt-6">
              <button className="group flex items-center gap-2 bg-white text-purple-500 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out">
                Get In Touch
                <span className="transition-transform duration-500 group-hover:rotate-[360deg]">
                  <FaPaperPlane />
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-10 px-4 sm:px-6 md:px-16">
        <ContactHeroSection />
      </div>

      <div className="mt-10 px-4 sm:px-6 md:px-16">
        <ContactForm />
      </div>
      
    </section>
  );
};

export default ContactUs;

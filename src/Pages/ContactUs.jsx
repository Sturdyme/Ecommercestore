import React from "react";
import teamPic from "../assets/SupportTeamPic/teamPic.png";
import { FaPaperPlane } from "react-icons/fa";
import ContactHeroSection from "../Component/ContactHeroSection";
import ContactForm from "../Component/ContactForm";

const ContactUs = () => {
  return (
    <section>
      <div className="flex h-[500px] shadow-md overflow-hidden">
        
        {/* Image Section */}
        <div className="w-1/2 h-full">
          <img
            src={teamPic}
            alt="support-team"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Purple Content Section */}
        <div className="w-1/2 h-full bg-purple-500 flex items-start">
          
          <div className="px-16 mt-24">
            
            {/* Heading */}
            <p className="text-2xl font-thin text-white">
              We are Here To Help
            </p>

            <p className="text-white text-4xl mt-3">
              Have A Question About YossyVogue?
            </p>

            <p className="text-white mt-3">
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
      <div className="mt-10">  <ContactHeroSection/>  </div>
      <div className="mt-10"> <ContactForm/> </div>
      
    </section>
  );
};

export default ContactUs;

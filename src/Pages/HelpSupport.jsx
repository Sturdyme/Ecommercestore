import React, { useState } from 'react';
import { Search, Package, RefreshCcw, ShieldCheck, MessageCircle, ChevronDown } from 'lucide-react';
import ContactHeroSection from '../Component/ContactHeroSection';

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [shouldOpenChat, setShouldOpenChat] = useState(false);
  const quickLinks = [
    { title: "Track Order", icon: <Package className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
    { title: "Refunds", icon: <RefreshCcw className="w-6 h-6" />, color: "bg-orange-100 text-orange-600" },
    { title: "Security", icon: <ShieldCheck className="w-6 h-6" />, color: "bg-green-100 text-green-600" },
  ];

  const faqs = [
    { q: "How do I track my package?", a: "Once your order ships, you will receive an email with a tracking link. You can also track it via the 'My Orders' section in your dashboard." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy for most items. Items must be in their original packaging with tags attached." },
    { q: "How can I change my shipping address?", a: "Addresses can be changed within 2 hours of placing an order by contacting our support team via Live Chat." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans text-slate-800">
      {/* 1. Header & Search */}
      <div className="text-center mb-12">
        <h1 className="text-3xl text-black dark:text-white font-bold mb-4">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for articles, orders..." 
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* 2. Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {quickLinks.map((link, i) => (
          <button key={i} className="flex flex-col items-center p-6 border border-slate-100 rounded-2xl hover:shadow-lg transition-shadow bg-gray-900 text-white dark:text-black dark:bg-white">
            <div className={`p-4 rounded-full  mb-4 ${link.color}`}>
              {link.icon}
            </div>
            <span className="font-semibold">{link.title}</span>
          </button>
        ))}
      </div>

      {/* 3. FAQ Section */}
      <div className="mb-16">
        <h2 className="text-2xl text-black dark:text-white font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-100">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex justify-between text-black dark:text-white items-center py-4 text-left font-medium hover:text-blue-600"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === index && (
                <div className="pb-4  text-black dark:text-white animate-in fade-in duration-300">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Contact Support Footer */}
      <div className="bg-slate-900 dark:bg-slate-100 rounded-3xl p-8 text-center text-black dark:text-white">
        <h3 className="text-xl text-white dark:text-black font-semibold mb-2">Still need help?</h3>
        <p className="text-white dark:text-black mb-6 text-sm">Our support team is available 24/7 to assist you.</p>
        <button 
        onClick={() => setShouldOpenChat(true)}
        className="flex items-center mx-auto space-x-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 text-black dark:text-white rounded-xl transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Start Live Chat</span>
        </button>
      </div>

      <ContactHeroSection 
        forceOpen={shouldOpenChat} 
        onClose={() => setShouldOpenChat(false)} 
      />
    </div>
  );
};

export default HelpSupport;
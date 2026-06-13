import React, { useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import AIChatbox from "../Utilities/AiChatbox";

const AISupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <>
      <section className="bg-gray-100 dark:bg-gray-800 py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 rounded-2xl sm:rounded-3xl">
        <div className="max-w-5xl mx-auto text-center">

          {/* ICON */}
          <div className="flex justify-center">
            <div className="bg-purple-100 p-3 sm:p-4 rounded-full">
              <ChatBubbleLeftRightIcon className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
            </div>
          </div>

          {/* TITLE */}
          <h2 className="mt-5 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
            Need Support?
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-white max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            At <span className="font-semibold text-black dark:text-white">Yuna collective</span>, we're committed
            to making your shopping experience simple, secure, and enjoyable. Our
            AI Support Assistant is available to help answer your questions instantly.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-10 sm:mt-12 text-left">

            {/* CARD 1 */}
            <div className="bg-gray-200 dark:bg-gray-700 p-5 sm:p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What Can the AI Assistant Help With?
              </h3>

              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-white">
                <li>✅ Order tracking and delivery updates</li>
                <li>✅ Shipping information and delivery timelines</li>
                <li>✅ Payment methods and checkout assistance</li>
                <li>✅ Returns, refunds, and exchange policies</li>
                <li>✅ Product recommendations and sizing guidance</li>
                <li>✅ Account and login support</li>
                <li>✅ Order status and purchase history</li>
                <li>✅ General store inquiries</li>
              </ul>
            </div>

            {/* CARD 2 */}
            <div className="bg-gray-200 dark:bg-gray-700 p-5 sm:p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Why Use Our AI Support?
              </h3>

              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-white">
                <li>⚡ Instant responses 24/7</li>
                <li>🔒 Secure assistance</li>
                <li>📦 Quick shipping info</li>
                <li>💳 Payment guidance</li>
                <li>🛍️ Personalized shopping help</li>
                <li>🤝 Easy policy navigation</li>
                <li>📱 Works on all devices</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 sm:mt-12 bg-gray-200 dark:bg-gray-700 p-5 sm:p-8 rounded-2xl shadow-sm mx-2 sm:mx-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Start a Conversation
            </h3>

            <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-white max-w-2xl mx-auto">
              Track orders, learn about shipping, payments, refunds or anything
              related to Yuna collective — our AI is ready to help instantly.
            </p>

            <button
              onClick={openChat}
              className="inline-flex items-center mt-5 sm:mt-6 bg-purple-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition text-sm sm:text-base"
            >
              Chat With AI Assistant
            </button>
          </div>
        </div>
      </section>

      {/* CHATBOX */}
      {isChatOpen && <AIChatbox onClose={closeChat} />}
    </>
  );
};

export default AISupport;
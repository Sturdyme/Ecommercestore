import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function AIChatbox({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello 👋 How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: question }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Sorry, I couldn't process that request.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to the server.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div
      className="
        fixed bottom-0 right-0 sm:bottom-6 sm:right-6
        w-full sm:w-[380px]
        h-full sm:h-[600px]
        bg-white
        sm:rounded-2xl
        shadow-2xl border
        overflow-hidden flex flex-col
        z-50
      "
    >
      {/* HEADER */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <SparklesIcon className="w-5 h-5" />
          </div>

          <div>
            <h2 className="font-semibold text-base sm:text-lg">
              Yuna collective AI Assistant
            </h2>

            <p className="text-xs sm:text-sm text-slate-300">
              Online • Ask about orders, shipping & payments
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="hover:bg-white/10 p-2 rounded-lg transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-5 sm:space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[85%] sm:max-w-[80%]
                  rounded-2xl px-4 sm:px-5 py-2 sm:py-3
                  text-sm leading-relaxed shadow-sm
                  ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-slate-800"
                  }
                `}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce delay-150">•</span>
                  <span className="animate-bounce delay-300">•</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t bg-white p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            placeholder="Ask anything..."
            className="flex-1 border border-slate-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 sm:px-5 rounded-xl transition flex items-center justify-center"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}